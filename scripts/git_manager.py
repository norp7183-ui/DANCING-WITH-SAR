"""
Git Repository Management for NISAR Mangrove Change Detection
Handles staging, committing, and pushing to https://github.com/norp7183-ui/DANCING-WITH-SAR.git
"""

import os
import sys
from pathlib import Path
import dulwich.porcelain as porcelain
import dulwich.repo
from dulwich.client import get_transport_and_path

REMOTE_URL = "https://github.com/norp7183-ui/DANCING-WITH-SAR.git"
COMMIT_MESSAGE = "Initial commit: NISAR SAR change detection project"


def get_or_init_repo():
    repo_path = Path(".")
    if not (repo_path / ".git").exists():
        repo = dulwich.repo.Repo.init(str(repo_path))
        print("[INFO] Initialized fresh Git repository at:", repo_path)
    else:
        repo = dulwich.repo.Repo(str(repo_path))
        print("[INFO] Opened existing Git repository at:", repo_path)
    return repo


def configure_git_user(repo):
    config = repo.get_config()
    try:
        user_name = config.get((b"user",), b"name")
    except KeyError:
        user_name = None
    try:
        user_email = config.get((b"user",), b"email")
    except KeyError:
        user_email = None

    if not user_name:
        config.set((b"user",), b"name", b"norp7183-ui")
        print("[INFO] Configured Git user.name: norp7183-ui")
    else:
        print("[INFO] Existing Git user.name:", user_name.decode("utf-8", errors="replace"))

    if not user_email:
        config.set((b"user",), b"email", b"norp7183-ui@users.noreply.github.com")
        print("[INFO] Configured Git user.email: norp7183-ui@users.noreply.github.com")
    else:
        print("[INFO] Existing Git user.email:", user_email.decode("utf-8", errors="replace"))

    config.write_to_path()


def stage_and_commit(repo):
    print("\n--- Staging Files ---")
    
    # Collect all valid files, excluding __pycache__, scratch, large rasters, credentials
    staged_files = []
    
    # We walk the directory and add files using porcelain.add
    # porcelain.add honors .gitignore
    porcelain.add(repo.path)
    
    # Check status
    status = porcelain.status(repo.path)
    print("Staged files count:", len(status.staged["add"]))
    for f in status.staged["add"]:
        f_str = f.decode("utf-8", errors="replace")
        print(f"  + {f_str}")
        
    if not status.staged["add"] and not status.staged["modify"]:
        print("[INFO] No new files to commit.")
        return None
        
    print(f"\n--- Creating Commit: '{COMMIT_MESSAGE}' ---")
    commit_sha = porcelain.commit(
        repo.path,
        message=COMMIT_MESSAGE.encode("utf-8")
    )
    print(f"[SUCCESS] Created commit: {commit_sha.decode('ascii')}")
    return commit_sha


def setup_remote(repo):
    config = repo.get_config()
    try:
        existing_url = config.get((b"remote", b"origin"), b"url")
        print(f"[INFO] Remote 'origin' already configured: {existing_url.decode('utf-8')}")
        if existing_url.decode("utf-8") != REMOTE_URL:
            config.set((b"remote", b"origin"), b"url", REMOTE_URL.encode("utf-8"))
            config.write_to_path()
            print(f"[INFO] Updated remote 'origin' to: {REMOTE_URL}")
    except KeyError:
        config.set((b"remote", b"origin"), b"url", REMOTE_URL.encode("utf-8"))
        config.set((b"remote", b"origin"), b"fetch", b"+refs/heads/*:refs/remotes/origin/*")
        config.write_to_path()
        print(f"[INFO] Configured remote 'origin': {REMOTE_URL}")


def test_push(repo):
    print(f"\n--- Pushing to {REMOTE_URL} (branch: main) ---")
    try:
        # Attempt push
        porcelain.push(repo.path, REMOTE_URL, "refs/heads/main")
        print("[SUCCESS] Successfully pushed branch 'main' to GitHub!")
        return True
    except Exception as e:
        print(f"[PUSH_STATUS] Push did not complete automatically: {type(e).__name__}: {e}")
        return False


def main():
    repo = get_or_init_repo()
    configure_git_user(repo)
    setup_remote(repo)
    commit_sha = stage_and_commit(repo)
    push_success = test_push(repo)
    
    print("\n==========================================")
    print("Repository Status:")
    print(f"  Remote URL: {REMOTE_URL}")
    print(f"  Branch:     main")
    print(f"  Commit:     {commit_sha.decode('ascii') if commit_sha else 'Existing'}")
    print(f"  Pushed:     {push_success}")
    print("==========================================")


if __name__ == "__main__":
    main()
