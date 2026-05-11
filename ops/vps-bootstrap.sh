#!/usr/bin/env bash
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-deploy}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/khovrov.dev}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

if [[ -z "${DEPLOY_PUBLIC_KEY:-}" ]]; then
  echo "DEPLOY_PUBLIC_KEY is required." >&2
  exit 1
fi

if [[ -z "${GITHUB_ACTIONS_PUBLIC_KEY:-}" ]]; then
  echo "GITHUB_ACTIONS_PUBLIC_KEY is required." >&2
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl gnupg lsb-release ufw

install -m 0755 -d /etc/apt/keyrings
if [[ ! -f /etc/apt/keyrings/docker.gpg ]]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
fi

if [[ ! -f /etc/apt/sources.list.d/docker.list ]]; then
  . /etc/os-release
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
fi

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

if ! id "${DEPLOY_USER}" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "${DEPLOY_USER}"
fi

usermod -aG sudo "${DEPLOY_USER}"
usermod -aG docker "${DEPLOY_USER}"

install -d -m 700 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"
authorized_keys="/home/${DEPLOY_USER}/.ssh/authorized_keys"
touch "${authorized_keys}"
chown "${DEPLOY_USER}:${DEPLOY_USER}" "${authorized_keys}"
chmod 600 "${authorized_keys}"

grep -qxF "${DEPLOY_PUBLIC_KEY}" "${authorized_keys}" || echo "${DEPLOY_PUBLIC_KEY}" >> "${authorized_keys}"
grep -qxF "${GITHUB_ACTIONS_PUBLIC_KEY}" "${authorized_keys}" || echo "${GITHUB_ACTIONS_PUBLIC_KEY}" >> "${authorized_keys}"

mkdir -p "${DEPLOY_PATH}"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${DEPLOY_PATH}"

ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

systemctl enable --now docker

echo "VPS bootstrap complete."
echo "Deploy user: ${DEPLOY_USER}"
echo "Deploy path: ${DEPLOY_PATH}"
