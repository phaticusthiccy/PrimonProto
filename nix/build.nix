{ pkgs }: with pkgs; {
    deps = [
        yarn
        esbuild
        nodejs-16_x

        nodePackages.typescript
        nodePackages.typescript-language-server
    ];
}