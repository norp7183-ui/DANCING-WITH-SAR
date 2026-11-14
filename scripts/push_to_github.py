"""
Secure GitHub Push Script for DANCING-WITH-SAR
Pushes commit 3b547c0 to https://github.com/norp7183-ui/DANCING-WITH-SAR.git
Never prints, logs, or saves tokens or credentials.
"""

import os
import sys
import getpass
from pathlib import Path
import dulwich.porcelain as porcelain
import dulwich.repo
from dulwich.client import get_transport_and_path

REMOTE_REPO = "norp7183-ui/DANCING-WITH-SAR.git"
BASE_URL = f"https://github.com/{REMOTE_REPO}"


def get_token():
    # 1. Check environment
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        print("[INFO] Found GitHub token in environment variable.")
        return token.strip()
        
    # 2. Interactive prompt
    print("=================================================================")
    print(" GitHub Authentication Required                                  ")
    print(f" Target Repository: https://github.com/{REMOTE_REPO}            ")
    print("=================================================================")
    print("Please enter your GitHub Personal Access Token (PAT) with 'repo' scope.")
    print("If you do not have one, generate it at: https://github.com/settings/tokens")
    print("Your input will be masked and will NOT be saved or logged.\n")
    try:
        token = getpass.getpass("GitHub Token: ").strip()
        return token
    except Exception as e:
        print(f"[ERROR] Could not read token: {e}")
        return None


def push_repo(token):
    if not token:
        print("[ERROR] No token provided. Push cancelled.")
        return False
        
    repo = dulwich.repo.Repo(".")
    # Construct authenticated URL securely in memory
    auth_url = f"https://x-access-token:{token}@github.com/{REMOTE_REPO}"
    
    print("\n[INFO] Connecting to GitHub and pushing 'main' branch...")
    try:
        porcelain.push(repo.path, auth_url, "refs/heads/main")
        print("[SUCCESS] Successfully pushed branch 'main' to GitHub!")
        return True
    except Exception as e:
        print(f"[ERROR] Push failed: {type(e).__name__}: {e}")
        return False
    finally:
        # Wipe token from memory
        token = None
        auth_url = None


def verify_remote():
    print("\n[INFO] Verifying remote repository state on GitHub...")
    try:
        client, path = get_transport_and_path(BASE_URL)
        res = client.get_refs(path)
        main_sha = res.refs.get(b"refs/heads/main")
        if main_sha:
            print(f"[CONFIRMED] Remote branch 'main' verified at SHA: {main_sha.decode('ascii')}")
            return True
        else:
            print("[NOTICE] 'refs/heads/main' not yet visible on remote.")
            return False
    except Exception as e:
        print(f"[WARNING] Could not verify remote refs: {e}")
        return False


def main():
    token = get_token()
    if not token:
        print("[BLOCKED] Awaiting user to provide authentication.")
        return
        
    success = push_repo(token)
    if success:
        verify_remote()
        print("\n=======================================================")
        print(f" Repository published successfully:")
        print(f" https://github.com/{REMOTE_REPO.replace('.git', '')}")
        print("=======================================================")


if __name__ == "__main__":
    main()
