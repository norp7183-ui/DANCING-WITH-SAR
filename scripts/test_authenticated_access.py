"""
NASA Earthdata Authenticated HTTPS Access and Range Benchmark
Granule: NISAR_L2_PR_GCOV_032_019_D_077_2005_QPDH_A_20261001T124313_20261001T124348_P05023_N_F_J_001

Supports user-controlled authentication strategies:
  - interactive: earthaccess.login(strategy="interactive", persist=False)
  - environment: reads EARTHDATA_TOKEN or EARTHDATA_USERNAME/EARTHDATA_PASSWORD
  - netrc: reads ~/.netrc or ~/_netrc
  - auto: auto-selects environment/netrc if available, else interactive
"""

import os
import sys
import time
import json
import logging
import argparse
from pathlib import Path
import urllib.parse

# Set up logging - ensure credentials and tokens are NEVER printed or logged
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("EarthdataAccessTest")

TARGET_GRANULE = "NISAR_L2_PR_GCOV_032_019_D_077_2005_QPDH_A_20261001T124313_20261001T124348_P05023_N_F_J_001"
TARGET_URL = (
    f"https://nisar.asf.earthdatacloud.nasa.gov/NISAR/NISAR_L2_GCOV_PROVISIONAL_V1/"
    f"{TARGET_GRANULE}/{TARGET_GRANULE}.h5"
)
HDF5_SIGNATURE = b"\x89HDF\r\n\x1a\n"

# 100x100 pixel window for selective verification (no full download)
WINDOW_ROWS = 100
WINDOW_COLS = 100


def check_credential_availability():
    """Verify whether Earthdata credentials or tokens exist without exposing them."""
    has_token = bool(os.environ.get("EARTHDATA_TOKEN"))
    has_user_pass = bool(os.environ.get("EARTHDATA_USERNAME") and os.environ.get("EARTHDATA_PASSWORD"))
    
    home = Path.home()
    has_netrc = (home / ".netrc").exists() or (home / "_netrc").exists()
    
    return {
        "has_token_in_env": has_token,
        "has_user_pass_in_env": has_user_pass,
        "has_netrc_on_disk": has_netrc,
        "credentials_configured": has_token or has_user_pass or has_netrc
    }


def authenticate_earthaccess(strategy="interactive"):
    """
    Authenticate via earthaccess using the requested strategy.
    Supports 'interactive', 'environment', 'netrc', and 'auto'.
    Never logs, prints, or saves credentials or tokens.
    """
    import earthaccess
    
    cred_status = check_credential_availability()
    selected_strategy = strategy.lower()
    
    if selected_strategy == "auto":
        if cred_status["has_token_in_env"] or cred_status["has_user_pass_in_env"]:
            selected_strategy = "environment"
        elif cred_status["has_netrc_on_disk"]:
            selected_strategy = "netrc"
        else:
            selected_strategy = "interactive"
            
    logger.info(f"Authenticating via earthaccess using strategy='{selected_strategy}' (persist=False)...")
    
    try:
        auth = earthaccess.login(strategy=selected_strategy, persist=False)
        if not auth or not auth.authenticated:
            logger.error(f"Authentication with strategy='{selected_strategy}' did not succeed.")
            return None, selected_strategy
        logger.info("Earthdata authentication successful.")
        return auth, selected_strategy
    except Exception as e:
        logger.error(f"earthaccess.login(strategy='{selected_strategy}') failed: {e}")
        return None, selected_strategy


def probe_urs_challenge(session, target_url):
    """Examine URS OAuth redirect structure without transmitting sensitive tokens."""
    t0 = time.perf_counter()
    resp = session.get(target_url, allow_redirects=False)
    elapsed = time.perf_counter() - t0
    
    location = resp.headers.get("Location", "")
    parsed_loc = urllib.parse.urlparse(location)
    query_params = urllib.parse.parse_qs(parsed_loc.query)
    
    info = {
        "status_code": resp.status_code,
        "elapsed_seconds": round(elapsed, 4),
        "location": location.split("?")[0] if location else None,
        "oauth_client_id": query_params.get("client_id", [None])[0],
        "oauth_app_type": query_params.get("app_type", [None])[0],
        "redirect_uri": query_params.get("redirect_uri", [None])[0],
        "server": resp.headers.get("Server", "Unknown")
    }
    return info


def test_initial_small_range(session, data_url):
    """
    Step 4 Requirement:
    First test a small byte range and verify:
      - HTTP 206 Partial Content
      - Correct Content-Range header
      - HDF5 magic signature
      - Actual binary response, not HTML
    """
    logger.info("Testing initial small byte range (bytes=0-511) with authenticated session...")
    t0 = time.perf_counter()
    range_header = "bytes=0-511"
    
    try:
        r = session.get(data_url, headers={"Range": range_header}, stream=True, timeout=30)
        chunk = r.raw.read(512 + 128)
        elapsed = time.perf_counter() - t0
        
        status = r.status_code
        content_range = r.headers.get("Content-Range", "None")
        content_type = r.headers.get("Content-Type", "Unknown")
        bytes_received = len(chunk)
        
        # Check HDF5 magic bytes (\x89HDF\r\n\x1a\n)
        has_hdf5_magic = chunk.startswith(HDF5_SIGNATURE)
        is_html = ("html" in content_type.lower()) or (b"<html" in chunk.lower()) or (b"<!doctype" in chunk.lower())
        is_206 = (status == 206)
        content_range_valid = ("bytes 0-511/" in content_range)
        
        passed = is_206 and content_range_valid and has_hdf5_magic and (not is_html)
        
        result = {
            "test_name": "initial_small_range_probe",
            "range_requested": range_header,
            "http_status": status,
            "is_http_206": is_206,
            "content_range_returned": content_range,
            "content_range_matches": content_range_valid,
            "content_type": content_type,
            "bytes_received": bytes_received,
            "hdf5_signature_found": has_hdf5_magic,
            "is_binary_not_html": not is_html,
            "latency_ms": round(elapsed * 1000, 2),
            "verification_passed": passed
        }
        
        logger.info(
            f"Small range probe: HTTP {status}, Content-Range: {content_range}, "
            f"Bytes: {bytes_received}, HDF5 Sig: {has_hdf5_magic}, Binary: {not is_html}, Passed: {passed}"
        )
        return result, passed
    except Exception as e:
        elapsed = time.perf_counter() - t0
        logger.error(f"Small range probe failed with exception: {e}")
        return {
            "test_name": "initial_small_range_probe",
            "range_requested": range_header,
            "http_status": 0,
            "error": str(e),
            "latency_ms": round(elapsed * 1000, 2),
            "verification_passed": False
        }, False


def test_full_range_suite(session, data_url):
    """Run four representative byte-range requests and measure latency and throughput."""
    logger.info("Executing comprehensive HTTP Range request benchmark...")
    ranges_to_test = [
        ("Superblock Header (0-511)", "bytes=0-511", 512),
        ("Root B-tree Block (0-4095)", "bytes=0-4095", 4096),
        ("Middle Chunk Sample (1M-1M+4K)", "bytes=1048576-1052671", 4096),
        ("Extended Header Window (0-65535)", "bytes=0-65535", 65536),
    ]
    
    benchmark_results = []
    total_bytes = 0
    total_time = 0.0
    
    for label, range_hdr, expected_len in ranges_to_test:
        t0 = time.perf_counter()
        try:
            r = session.get(data_url, headers={"Range": range_hdr}, stream=True, timeout=30)
            chunk_data = r.raw.read(expected_len + 1024)
            elapsed = time.perf_counter() - t0
            
            bytes_received = len(chunk_data)
            total_bytes += bytes_received
            total_time += elapsed
            
            has_sig = chunk_data.startswith(HDF5_SIGNATURE)
            content_range = r.headers.get("Content-Range", "None")
            content_type = r.headers.get("Content-Type", "Unknown")
            status = r.status_code
            
            res_entry = {
                "label": label,
                "range_header": range_hdr,
                "http_status": status,
                "content_range": content_range,
                "content_type": content_type,
                "bytes_transferred": bytes_received,
                "latency_ms": round(elapsed * 1000, 2),
                "hdf5_signature_found": has_sig,
                "is_partial_content_206": (status == 206)
            }
            benchmark_results.append(res_entry)
        except Exception as e:
            elapsed = time.perf_counter() - t0
            logger.error(f"Error requesting {range_hdr}: {e}")
            benchmark_results.append({
                "label": label,
                "range_header": range_hdr,
                "http_status": 0,
                "error": str(e),
                "latency_ms": round(elapsed * 1000, 2),
                "hdf5_signature_found": False
            })
            
    return benchmark_results, total_bytes, total_time


def test_remote_fsspec_h5py_slicing(fs, data_url):
    """
    Step 5 Requirement:
    Attempt remote HDF5 metadata, coordinate vectors, and 100x100 HHHH and mask window reads.
    Uses authenticated fsspec filesystem returned by earthaccess.get_fsspec_https_session().
    Configures and verifies block-cache (8MB) on this authenticated filesystem,
    with h5py page buffer (16MB). Validates data values and mask definitions.
    """
    logger.info("Testing authenticated fsspec filesystem + h5py remote metadata and window reads...")
    import h5py
    import numpy as np
    
    t0 = time.perf_counter()
    io_metrics = {
        "metadata_readable": False,
        "coordinates_readable": False,
        "window_readable": False,
        "mask_readable": False,
        "fsspec_fs_type": type(fs).__name__,
        "fsspec_cache_verified": False,
        "elapsed_seconds": 0.0,
        "error": None
    }
    
    try:
        # Configure block cache directly on the authenticated filesystem
        with fs.open(data_url, mode="rb", cache_type="blockcache", block_size=8 * 1024 * 1024) as f_obj:
            # Verify block cache layer and operational statistics
            cache_obj = getattr(f_obj, "cache", None)
            cache_name = type(cache_obj).__name__ if cache_obj else "Direct"
            io_metrics["fsspec_cache_type"] = cache_name
            io_metrics["fsspec_cache_verified"] = bool(cache_obj is not None)
            
            initial_cache_info = None
            if cache_obj and hasattr(cache_obj, "cache_info"):
                initial_cache_info = cache_obj.cache_info()
                io_metrics["block_size_bytes"] = getattr(cache_obj, "blocksize", 8 * 1024 * 1024)
            
            with h5py.File(f_obj, "r", page_buf_size=16 * 1024 * 1024, rdcc_nbytes=4 * 1024 * 1024) as h5:
                # 1. Read metadata
                grid_group = h5["/science/LSAR/GCOV/grids/frequencyA"]
                datasets = list(grid_group.keys())
                io_metrics["metadata_readable"] = True
                io_metrics["datasets_found"] = datasets
                logger.info(f"HDF5 metadata successfully loaded. Datasets: {datasets}")
                
                # 2. Read coordinate vectors
                x_coords = grid_group["xCoordinates"][:10]
                y_coords = grid_group["yCoordinates"][:10]
                io_metrics["coordinates_readable"] = True
                io_metrics["sample_x_coords"] = [float(v) for v in x_coords]
                io_metrics["sample_y_coords"] = [float(v) for v in y_coords]
                
                # 3. Read 100x100 diagonal power window (HHHH)
                diag_key = "HHHH" if "HHHH" in grid_group else ("HH" if "HH" in grid_group else datasets[0])
                diag_ds = grid_group[diag_key]
                window_data = diag_ds[:WINDOW_ROWS, :WINDOW_COLS]
                
                finite_mask = np.isfinite(window_data)
                finite_ratio = float(np.mean(finite_mask))
                
                io_metrics["window_readable"] = True
                io_metrics["window_dataset"] = diag_key
                io_metrics["window_shape"] = list(window_data.shape)
                io_metrics["window_finite_ratio"] = finite_ratio
                if np.any(finite_mask):
                    io_metrics["window_min_val"] = float(np.nanmin(window_data))
                    io_metrics["window_max_val"] = float(np.nanmax(window_data))
                    io_metrics["window_mean_val"] = float(np.nanmean(window_data))
                    io_metrics["data_values_valid"] = True
                else:
                    io_metrics["data_values_valid"] = False
                    
                logger.info(f"Read {diag_key} window: shape={window_data.shape}, finite_ratio={finite_ratio:.3f}")
                
                # 4. Read corresponding mask window
                if "mask" in grid_group:
                    mask_ds = grid_group["mask"]
                    mask_data = mask_ds[:WINDOW_ROWS, :WINDOW_COLS]
                    
                    # Valid mask formula per JPL D-102274: (mask > 0) & (mask != 255)
                    valid_pixels = int(np.sum((mask_data > 0) & (mask_data != 255)))
                    invalid_mask0 = int(np.sum(mask_data == 0))
                    nodata_mask255 = int(np.sum(mask_data == 255))
                    
                    io_metrics["mask_readable"] = True
                    io_metrics["mask_shape"] = list(mask_data.shape)
                    io_metrics["valid_pixel_count"] = valid_pixels
                    io_metrics["invalid_count_mask0"] = invalid_mask0
                    io_metrics["nodata_count_mask255"] = nodata_mask255
                    io_metrics["mask_values_valid"] = True
                    logger.info(
                        f"Read mask window: valid={valid_pixels}, invalid_0={invalid_mask0}, nodata_255={nodata_mask255}"
                    )
            
            # Post-read cache validation to prove cache was actively used
            if cache_obj and hasattr(cache_obj, "cache_info"):
                final_cache_info = cache_obj.cache_info()
                io_metrics["cache_stats"] = {
                    "hits": final_cache_info.hits,
                    "misses": final_cache_info.misses,
                    "currsize_blocks": final_cache_info.currsize,
                    "maxsize_blocks": final_cache_info.maxsize,
                    "block_size_mb": round(getattr(cache_obj, "blocksize", 8 * 1024 * 1024) / (1024 * 1024), 2),
                    "cache_functioning": bool(final_cache_info.hits > 0 or final_cache_info.currsize > 0)
                }
                logger.info(
                    f"Cache Performance Verified: hits={final_cache_info.hits}, "
                    f"misses={final_cache_info.misses}, currsize={final_cache_info.currsize} blocks, "
                    f"functioning={io_metrics['cache_stats']['cache_functioning']}"
                )
                    
        io_metrics["elapsed_seconds"] = round(time.perf_counter() - t0, 3)
    except Exception as e:
        io_metrics["elapsed_seconds"] = round(time.perf_counter() - t0, 3)
        io_metrics["error"] = str(e)
        logger.error(f"Remote slicing failed: {e}")
        
    return io_metrics


def main():
    parser = argparse.ArgumentParser(description="NASA Earthdata Authenticated HTTPS Range Benchmark")
    parser.add_argument(
        "--strategy",
        choices=["interactive", "environment", "netrc", "auto"],
        default="interactive",
        help="Authentication strategy: interactive, environment, netrc, or auto (default: interactive)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only probe URS challenge and check credentials without initiating login prompt"
    )
    args = parser.parse_args()
    
    print("=================================================================")
    print(" NASA Earthdata Authenticated HTTPS Access Verification Suite   ")
    print(f" Target Granule: {TARGET_GRANULE[:50]}...")
    print(f" Authentication Strategy: {args.strategy}")
    print("=================================================================\n")
    
    import requests
    cred_status = check_credential_availability()
    print("Credential State Audit:")
    for k, v in cred_status.items():
        print(f"  - {k}: {v}")
        
    session = requests.Session()
    challenge_info = probe_urs_challenge(session, TARGET_URL)
    print("\nLive URS OAuth Challenge Probed:")
    print(f"  - HTTP Status: {challenge_info['status_code']}")
    print(f"  - OAuth Location: {challenge_info['location']}")
    print(f"  - OAuth Client ID: {challenge_info['oauth_client_id']}")
    print(f"  - App Type: {challenge_info['oauth_app_type']}")
    print(f"  - Latency: {challenge_info['elapsed_seconds']}s")
    
    if args.dry_run:
        print("\n[INFO] Dry run complete. Exiting without prompting for authentication.")
        return
        
    # Step 1 & 2: Authenticate using earthaccess
    auth, used_strategy = authenticate_earthaccess(strategy=args.strategy)
    if not auth or not auth.authenticated:
        print(f"\n[BLOCKED] Authentication failed or cancelled using strategy='{used_strategy}'.")
        # Update benchmark JSON with status
        status_payload = {
            "target_granule": TARGET_GRANULE,
            "target_url": TARGET_URL,
            "credential_availability": cred_status,
            "urs_challenge": challenge_info,
            "auth_strategy_attempted": used_strategy,
            "test_status": "AUTHENTICATION_FAILED_OR_CANCELLED",
            "compliance_note": "No credentials or tokens saved or committed."
        }
        with open("data/processed/http_range_benchmark.json", "w", encoding="utf-8") as f:
            json.dump(status_payload, f, indent=2)
        return
        
    # Step 3: Get authenticated requests session
    import earthaccess
    auth_session = earthaccess.get_requests_https_session()
    
    # Step 4: First test small byte range
    probe_res, probe_passed = test_initial_small_range(auth_session, TARGET_URL)
    print("\nInitial Small Byte Range Test (bytes=0-511):")
    for k, v in probe_res.items():
        print(f"  - {k}: {v}")
        
    if not probe_passed:
        print("\n[FAIL] Initial byte range probe did not return valid HDF5 binary partial content.")
        status_payload = {
            "target_granule": TARGET_GRANULE,
            "target_url": TARGET_URL,
            "auth_strategy": used_strategy,
            "small_range_probe": probe_res,
            "test_status": "RANGE_PROBE_FAILED",
            "compliance_note": "No credentials or tokens saved or committed."
        }
        with open("data/processed/http_range_benchmark.json", "w", encoding="utf-8") as f:
            json.dump(status_payload, f, indent=2)
        return
        
    # Step 5: Test full range suite using authenticated requests session
    range_results, total_bytes, total_time = test_full_range_suite(auth_session, TARGET_URL)
    
    # Step 6: Obtain authenticated fsspec filesystem and attempt remote HDF5 metadata & window reads
    fs_authenticated = earthaccess.get_fsspec_https_session()
    io_metrics = test_remote_fsspec_h5py_slicing(fs_authenticated, TARGET_URL)
    
    # Step 7: Record performance measurements safely
    final_benchmark = {
        "target_granule": TARGET_GRANULE,
        "target_url": TARGET_URL,
        "auth_strategy": used_strategy,
        "small_range_probe": probe_res,
        "comprehensive_range_benchmark": {
            "requests": range_results,
            "total_bytes_transferred": total_bytes,
            "total_time_seconds": round(total_time, 3),
            "average_latency_ms": round((total_time / len(range_results)) * 1000, 2) if range_results else 0.0,
            "throughput_kb_s": round((total_bytes / 1024.0) / total_time, 2) if total_time > 0 else 0.0
        },
        "remote_slicing_metrics": io_metrics,
        "test_status": "COMPLETED",
        "compliance_note": "No credentials, cookies, authorization headers or tokens recorded."
    }
    
    output_path = Path("data/processed/http_range_benchmark.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_benchmark, f, indent=2)
    print(f"\n[SUCCESS] Benchmark results saved to {output_path}")
    print(f"Total Bytes Transferred: {total_bytes:,} bytes")
    print(f"Total Time: {total_time:.3f} s")
    print(f"Metadata Readable: {io_metrics.get('metadata_readable')}")
    print(f"100x100 Window Readable: {io_metrics.get('window_readable')}")
    print(f"Mask Readable: {io_metrics.get('mask_readable')}")


if __name__ == "__main__":
    main()
