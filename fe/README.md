# Repositori IT PIONIR 2025

## Design

[Figma Link](https://www.figma.com/files/team/1230877834990330643/project/355707487/PIONIR-Gadjah-Mada-2025?fuid=1360546456182338347)

## How To Run

Install all dependencies and run the development server using this command

- **yarn** (recommended)

  ```
  yarn install
  yarn dev
  ```

- **npm**

  ```
  npm i
  npm run dev
  ```

## Running Production Build on Docker (experimental)

1. Install docker desktop
2. Log in and run docker dekstop
3. Go to root folder using command line
4. Build your project
   ```
   make build
   ```
5. Run the production image
   ```
   make start
   ```
   Now the website is accessible through localhost:3000 as usual
6. To stop the server, run:
   ```
   make stop
   ```

### Tips: Optimizing Docker

To reduce docker image size, use this command

1. After build the project using docker, reduce file size using this command
   ```
   make build-slim
   ```
2. Run the optimized production image
   ```
   make start-slim
   ```
3. To stop it, use
   ```
   make stop-slim
   ```

## Pull & Push Schema

1. Checkout to develop branch
2. Pull origin develop
3. Create a new branch (Please read the rule below this section)
4. Checkout to the new branch
5. Code
6. Commit (Please follow the commit messages rule)
7. Pull origin develop
8. Push origin "your branch name"
9. Create a new pull request to develop branch and mention me (arya) :v
10. Done

## Branch Naming

`<type>/<short_description>.<nama_kamu>`

- `<type>` :
  - feature: saya menambahkan fitur baru
  - fixing: saya memperbaiki fitur

Contoh: feature/navbar.arya

## Commit message

`<type>(<scope>): <short_summary>`

- `<type>` :

  - feat: saya menambahkan fitur baru
  - fix: saya memperbaiki fitur

- `<scope>` : ini opsional
- `<summart>` : buat sejelas mungkin

Contoh: feat[Homepage]: Creating about section

## Folder Structure

```
- public: file public (including assets)
- app : Contain all pages
- src
    - components : all components (layouts, button, navbar, etc)
        - Contexts: custom context
        - Element : Element kecil - kecil
        - Layout  : Berisi Layout untuk website, default, error, dkk
    - utils : Folder berisi fungsi - fungsi
        - helpers : pembantu (fetch backend, etc)
        - hooks : custom hooks
    - modules: all views
        - [Page name]
            - page.js
    - styles: kumpulan styling css
```

## Aturan Penulisan Variabel / File

- Gunakan **PascalCase** untuk menulis nama komponen / file komponen website
  DefaultLayout.js, Navbar.js
- Gunakan **camelCase** untuk menulis nama variabel / file non komponen
  data.js, dataFaq.js, createdAt, dkk
- Selalu gunakan .js file! Biar keliatan rapi + seragam aja reponya.

## Notes

- kalo branch mu udah di merge, jangan lupa juga buat hapus branch mu dari github (biar rapi :>)

## Clean Code

- [Learn More](https://github.com/ryanmcdermott/clean-code-javascript)
- [Learn More 2](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29#:~:text=Code%20is%20clean%20if%20it,%2C%20changeability%2C%20extensibility%20and%20maintainability.)

## Need to be fix

- Pasang Default Layout
