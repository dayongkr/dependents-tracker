# dependents-tracker

A project to track dependents of a given repository on GitHub.

## Setting up the project

### 1. Fork the repository

Click on the fork button on the top right corner of the repository.

And clone the forked repository.

```bash
git clone https://github.com/<your-username>/dependents-tracker.git
```

### 2. Change the configuration in `depedents.json` file

```json
{
  "owner": "toss",
  "package": "es-toolkit",
  "path": "apps/web/public"
}
```

- `owner`: The owner of the repository.
- `package`: The name of the repository.
- `path`: The path of a data file in the repository. (You don't need to change it.)

### 3. Turn on the GitHub Actions

Maybe, Github Actions is disabled in the forked repository. You need to turn it on.

> `Settings -> Actions -> General -> Click Allow all actions and reusable workflows`

And then, you also allow read and write access to the workflow.

> `Settings -> Actions -> General -> Workflow permissions -> Click Read and write permissions`

### 4. Trigger the workflow

By default, the workflow is triggered every day at 00:00 KST. But you can trigger it manually.

> `Actions -> Data Extractor -> Run workflow -> Click Run workflow`

The workflow will extract the dependents data and save it to the `path`(default: `apps/web/public`) in the repository.

### 5. Run the project

#### 5.1. Pull the extracted data

```bash
git pull
```

At first, you need to pull the extracted data that generated by the workflow.

#### 5.2. Install the dependencies

```bash
npm install
pnpm install
```

You have to install the dependencies before running the project.

#### 5.3. Run the project

```bash
npm dev
pnpm dev
```

And then, open the browser and go to `http://localhost:3000`.
