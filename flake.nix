{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-21.11";
  };
  outputs = { self, nixpkgs }@inputs:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShell.${system} = pkgs.mkShell {
        buildInputs = with pkgs; [
          jq
          nodejs-16_x
        ];
        shellHook = ''
          export PATH="$PWD/node_modules/.bin/:$PATH"
        '';
      };
    };
}
