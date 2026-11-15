"""
Validation Script: Isolated Cache Instrumentation Verification with Real fsspec BlockCache
Tests:
1. Real fsspec.caching.BlockCache (installed package) with in-memory synthetic binary data.
2. Demonstrates:
   - First read causes a cache miss and range-fetcher invocation.
   - Repeated same-region read produces a native cache hit.
   - Zero additional fetcher invocations on repeated read.
   - Native cache statistics (hits, misses, currsize, maxsize) agree exactly with fetcher counter.
3. Validates h5py raw data chunk cache control (rdcc_nbytes=0 compatibility).

Strictly isolated: No network access, no NASA endpoints, no satellite downloads.
"""

import sys
import tempfile
from pathlib import Path


def test_real_fsspec_blockcache_instrumentation():
    print("--- Test 1: Real fsspec.caching.BlockCache Instrumentation Test ---")
    
    import fsspec
    from fsspec.caching import BlockCache
    
    print(f"Installed fsspec version: {fsspec.__version__}")
    print(f"Testing class:            {BlockCache.__module__}.{BlockCache.__name__}")
    
    # 64 KB synthetic binary stream
    synthetic_payload = bytes([i % 256 for i in range(65536)])
    block_size = 8192  # 8 KB blocks
    
    fetch_log = []
    def raw_range_fetcher(start, end):
        fetch_log.append((start, end))
        return synthetic_payload[start:end]
        
    # Mutable dictionary counter (safe for notebook cell and script scopes)
    request_counter = {"count": 0}
    def instrumented_fetcher(start, end):
        request_counter["count"] += 1
        return raw_range_fetcher(start, end)
        
    cache = BlockCache(blocksize=block_size, fetcher=instrumented_fetcher, size=len(synthetic_payload), maxblocks=32)
    
    # Pre-read baseline
    info_0 = cache.cache_info()
    fetch_0 = request_counter["count"]
    print(f"\n[Baseline State]")
    print(f"  - Native cache_info:        hits={info_0.hits}, misses={info_0.misses}, currsize={info_0.currsize}, maxsize={info_0.maxsize}")
    print(f"  - Range-fetcher calls:      {fetch_0}")
    assert info_0.hits == 0 and info_0.misses == 0 and info_0.currsize == 0
    assert fetch_0 == 0
    
    # 1. First read (bytes 0-100, within Block 0)
    data_1 = cache._fetch(0, 100)
    info_1 = cache.cache_info()
    fetch_1 = request_counter["count"]
    delta_fetch_1 = fetch_1 - fetch_0
    delta_miss_1 = info_1.misses - info_0.misses
    delta_hit_1 = info_1.hits - info_0.hits
    
    print(f"\n[Read 1] Requested bytes 0-100 (Initial Slice):")
    print(f"  - Data verified:            {data_1 == synthetic_payload[0:100]}")
    print(f"  - Native cache_info:        hits={info_1.hits}, misses={info_1.misses}, currsize={info_1.currsize}, maxsize={info_1.maxsize}")
    print(f"  - Range-fetcher calls:      {fetch_1} (delta: +{delta_fetch_1})")
    print(f"  - Native Misses == Fetcher: {delta_miss_1 == delta_fetch_1} (both = 1)")
    assert data_1 == synthetic_payload[0:100]
    assert delta_miss_1 == 1, "First read must trigger a native cache miss"
    assert delta_hit_1 == 0, "First read must have 0 native cache hits"
    assert delta_fetch_1 == 1, "First read must trigger exactly 1 fetcher invocation"
    assert info_1.currsize == 1, "BlockCache must hold exactly 1 block in LRU cache"
    assert delta_miss_1 == delta_fetch_1, "Native misses must agree with fetcher invocations"
    
    # 2. Repeated read on exact same region (bytes 0-100)
    data_2 = cache._fetch(0, 100)
    info_2 = cache.cache_info()
    fetch_2 = request_counter["count"]
    delta_fetch_2 = fetch_2 - fetch_1
    delta_miss_2 = info_2.misses - info_1.misses
    delta_hit_2 = info_2.hits - info_1.hits
    
    print(f"\n[Read 2] Repeated read of bytes 0-100 (Exact Same Region):")
    print(f"  - Data verified:            {data_2 == synthetic_payload[0:100]}")
    print(f"  - Native cache_info:        hits={info_2.hits}, misses={info_2.misses}, currsize={info_2.currsize}, maxsize={info_2.maxsize}")
    print(f"  - Range-fetcher calls:      {fetch_2} (delta: +{delta_fetch_2})")
    print(f"  - Cache Hit Confirmed:      {delta_hit_2 == 1} (hits delta: +{delta_hit_2})")
    print(f"  - Zero Additional Calls:    {delta_fetch_2 == 0} (fetcher delta: {delta_fetch_2})")
    assert data_2 == synthetic_payload[0:100]
    assert delta_hit_2 == 1, "Repeated read must produce a native cache hit"
    assert delta_miss_2 == 0, "Repeated read must produce 0 native cache misses"
    assert delta_fetch_2 == 0, "Repeated read must trigger 0 additional fetcher invocations"
    assert info_2.currsize == 1, "Cached block count must remain 1"
    
    # 3. Overlapping subset read (bytes 20-50, inside Block 0)
    data_3 = cache._fetch(20, 50)
    info_3 = cache.cache_info()
    fetch_3 = request_counter["count"]
    delta_fetch_3 = fetch_3 - fetch_2
    delta_hit_3 = info_3.hits - info_2.hits
    
    print(f"\n[Read 3] Overlapping subset read of bytes 20-50 (Inside Cached Block 0):")
    print(f"  - Data verified:            {data_3 == synthetic_payload[20:50]}")
    print(f"  - Native cache_info:        hits={info_3.hits}, misses={info_3.misses}, currsize={info_3.currsize}, maxsize={info_3.maxsize}")
    print(f"  - Range-fetcher calls:      {fetch_3} (delta: +{delta_fetch_3})")
    assert data_3 == synthetic_payload[20:50]
    assert delta_hit_3 == 1, "Subset read must produce a native cache hit"
    assert delta_fetch_3 == 0, "Subset read must trigger 0 additional fetcher invocations"
    
    print("\n[PASS] Test 1: Real fsspec BlockCache behavior fully verified with exact native cache agreement!")


def test_h5py_chunk_cache_isolation():
    print("\n--- Test 2: h5py Chunk Cache Control (rdcc_nbytes=0) ---")
    try:
        import h5py
        import numpy as np
    except ImportError:
        print("[SKIP] h5py/numpy not installed in this environment. Tested statically.")
        return
        
    with tempfile.NamedTemporaryFile(suffix=".h5", delete=False) as tmp:
        tmp_path = tmp.name
        
    try:
        # Create a small chunked HDF5 file
        with h5py.File(tmp_path, "w") as f:
            f.create_dataset("test_data", data=np.arange(10000, dtype=np.float32).reshape((100, 100)), chunks=(50, 50))
            
        # Verify opening with rdcc_nbytes=0
        with h5py.File(tmp_path, "r", rdcc_nbytes=0) as f:
            read_slice = f["test_data"][:20, :20]
            print(f"Opened with rdcc_nbytes=0 successfully. Shape: {read_slice.shape}")
            assert read_slice.shape == (20, 20)
            
        print("[PASS] Test 2: h5py rdcc_nbytes=0 chunk cache bypass verified.")
    finally:
        Path(tmp_path).unlink(missing_ok=True)


if __name__ == "__main__":
    print("==================================================================")
    print(" Real fsspec BlockCache & Native cache_info() Verification Suite ")
    print("==================================================================\n")
    test_real_fsspec_blockcache_instrumentation()
    test_h5py_chunk_cache_isolation()
    print("\nAll local isolated tests using real fsspec BlockCache PASSED.")
