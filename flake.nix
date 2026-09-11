{
  description = "Dev shell for TS-clock-app-WanderVafla (Docker + Bun via docker-compose)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.docker
            pkgs.docker-compose
            pkgs.bun
          ];

          shellHook = ''
            docker compose up -d
          '';
        };
      });
}
