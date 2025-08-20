# folder-cleaner

A tiny CLI that keeps a directory under a size budget by deleting the oldest files first. Built with **Deno** and ordered by **file creation time** ("birth time") when available.

---

## Features

- Enforces a maximum folder size with human-friendly units.
- Optional extension filter to limit what gets considered.
- Dry-run by default; only deletes when explicitly told to.
- Simple flags, no config files, no drama.

---

## Requirements

- **Deno** v2.4.4+ (or any version that supports `deno compile` and `Deno.stat` `birthtime`)

---

## Installation

Run directly with Deno:

```sh
deno task execute
````

Compile a standalone binary:

```sh
deno task compile
```

---

## Quick start

Dry-run (show what would be deleted, but make no changes):

```sh
folder-cleaner \
  --target /var/opt/mssql/backup \
  --limit 1GiB \
  --ext .bak
```

Execute (actually delete files once the limit is exceeded):

```sh
folder-cleaner \
  --target /var/opt/mssql/backup \
  --limit 1GiB \
  --ext .bak \
  --exec
```

---

## CLI Options

| Option                 | Aliases           | Required | Description                                                                                                                                        |
| ---------------------- | ----------------- | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--target-dir <path>`  | `--target`        |     ✅    | Directory to monitor and clean.                                                                                                                    |
| `--size-limit <value>` | `--limit`         |     ✅    | Maximum total size for `--target-dir`. Accepts `kB`, `MB`, `GB`, `TB`, `KiB`, `MiB`, `GiB`, `TiB`. Examples: `500MB`, `1GiB`.                      |
| `--extensions <ext>`   | `--exts`, `--ext` |          | Only consider files with this extension. Example: `.log`, `log` or `.log,.txt,.csv`. (to add more extensions, use the comma symbol to separate extensions) |
| `--execute`            | `--exec`          |          | When present, performs deletions. If omitted, runs in dry-run mode and only prints what would happen.                                              |

---

## How it works

1. Scans `--target-dir` and optionally filters by `--extensions`.
2. Computes the total directory size.
3. If total size is over `--size-limit`, sorts candidates from oldest to newest using file **creation time**.

   * On filesystems that don’t expose creation time, behavior depends on platform support. Consider checking your OS and filesystem if ordering looks unexpected.
4. Deletes the oldest files until the directory falls at or under the limit.

   * This only happens when `--exec` is provided. Without it, nothing is deleted.

---

## Examples

Only manage `.log` files and enforce a 2 GB cap:

```sh
folder-cleaner --target /var/log/myapp --limit 2GB --ext log --exec
```

Dry-run on a media folder at 750 GiB:

```sh
folder-cleaner --target /mnt/media --limit 750GiB
```

Target with multiple extensions (repeat the flag if your parser supports it):

```sh
folder-cleaner --target ~/Downloads --limit 20GB --ext .zip --ext .7z --exec
```

Run from source with Deno and least-privilege permissions:

```sh
deno run \
  --allow-read=/var/opt/mssql/backup \
  --allow-write=/var/opt/mssql/backup \
  mod.ts \
  --target /var/opt/mssql/backup \
  --limit 1GiB \
  --ext bak \
  --exec
```

---

## Output

Typical dry-run header (actual format may vary):

```
folder-cleaner
Extensions:
Only watch and delete files with this extension.
Command flags: --extensions / --exts / --ext
Current value: [ "js" ]

Size Limit (required):
When the folder target exceeds this size, the program will deletes the oldest file.
Available sizes: "kB", "MB", "GB", "TB", "KiB", "MiB", "GiB", "TiB".
Command flags: --size-limit / --limit
Current value: "1.00 MB"

Target Folder (required):
The folder do you want to watch.
Command flags: --target-dir / --target
Current value: "/home/felipe-silva/projects/apps/legale-sdk-test"

Execute process (required):
If this flag is present, the CLI will delete the files that exceeds the size limit
setled. Otherwise, only shows the files without deleting them.
Command flags: --execute / --exec
Current value: false
---------------------------------------------------------------------------
Checking requeriments...
→ The parameter "Size Limit" is setled.
→ The parameter "Target Folder" is setled.
---------------------------------------------------------------------------
Checking folder...
Total size: "21.59 MB"
Birth: "2025-08-19T20:07:01.860Z"; Size:      "7.96 kB"; File: "index.js"
Birth: "2025-08-19T20:07:01.866Z"; Size:     "781.00 B"; File: "browser.js"
Birth: "2025-08-19T20:07:01.866Z"; Size:      "3.02 kB"; File: "index.js"
Birth: "2025-08-19T20:07:01.873Z"; Size:     "12.87 kB"; File: "index.js"
Birth: "2025-08-19T20:07:01.875Z"; Size:      "1.22 kB"; File: "index.js"
Birth: "2025-08-19T20:07:01.881Z"; Size:      "5.77 kB"; File: "index.js"
Birth: "2025-08-19T20:07:01.882Z"; Size:     "800.00 B"; File: "index.js"
Birth: "2025-08-19T20:07:01.882Z"; Size:      "5.78 kB"; File: "index.js"
Birth: "2025-08-19T20:07:01.883Z"; Size:      "6.48 kB"; File: "index.js"
Birth: "2025-08-19T20:07:01.883Z"; Size:     "343.00 B"; File: "index.js"
Birth: "2025-08-19T20:07:01.883Z"; Size:     "388.00 B"; File: "default.js"
...
Total size: "5.96 MB"
```

When `--exec` is provided, the tool performs the deletions and reports the new total.

---

## Caveats

* **Creation time ("birth time")** is not available on all filesystems. If your platform lacks it, ordering may differ or fall back to the platform’s best available metadata.
* Deletions are permanent. Always start with a **dry-run** to verify what will happen.

---

## License

MIT