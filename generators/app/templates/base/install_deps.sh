#! bin/sh

for directory in ./*/; do
    echo "Checking $directoryi ..."
    chmod o+x "$directory"
    cd "$directory"
    test -f "./package.json" && echo "Installing deps..." && npm install
    cd .. && echo "\n"
done