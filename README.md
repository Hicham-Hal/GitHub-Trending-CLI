# GitHub Trending CLI

A command-line tool that fetches and displays trending GitHub repositories using the GitHub REST API. Filter by time range and control how many results you see.

> **Note:** GitHub doesn't expose an official "trending" API. This tool approximates trending by searching for repositories *created* within your chosen time range, sorted by star count (using the [Search Repositories API](https://docs.github.com/en/rest/search/search#search-repositories)).

## Features

- Filter repositories by time range: `day`, `week`, `month`, or `year`
- Control the number of results returned
- No authentication required
- Clear, readable terminal output (name, description, stars, language)
- Input validation with helpful error messages

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher (uses the built-in `fetch` API)

## Installation

Clone the repository:

```bash
git clone https://github.com/Hicham-Hal/GitHub-Trending-CLI.git
cd GitHub-Trending-CLI
```

Link it globally so you can run it as a command from anywhere:

```bash
npm link
```

> If you get an `EACCES` permission error, either run `sudo npm link`, or configure npm to use a directory you own for global packages ([see npm docs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)).

## Usage

```bash
trending-repos [--duration <day|week|month|year>] [--limit <number>]
```

### Options

| Flag | Description | Default |
|---|---|---|
| `--duration` | Time range to filter by: `day`, `week`, `month`, or `year` | `week` |
| `--limit` | Number of repositories to display | `10` |

### Examples

Show this week's top 10 trending repos (defaults):
```bash
trending-repos
```

Show the top 20 trending repos from the past month:
```bash
trending-repos --duration month --limit 20
```

Show today's top 5 trending repos:
```bash
trending-repos --duration day --limit 5
```

### Sample output

```
Name: xai-org/grok-build
Description: Coding agent harness and TUI. Fullscreen, mouse interactive, extensible.
Stars: 24519
Language: Rust
*----------------*

Name: andrewyng/openworker
Description: No description
Stars: 13918
Language: Python
*----------------*
```

## Error handling

The tool validates your input before making any API request:

- `--duration` must be one of `day`, `week`, `month`, or `year`
- `--limit` must be a valid number and greater than 0
- Flags must be followed by a value

Invalid input prints a clear error message and exits without calling the API. Network or API errors (e.g. rate limits) are caught and reported as well.

## Rate limits

This tool makes unauthenticated requests to the GitHub API, which are limited to **60 requests per hour** per IP address. If you hit the limit, wait a bit before trying again.

## License

ISC