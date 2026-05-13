import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  RocketLaunchIcon,
  SparkleIcon,
  TerminalWindowIcon,
} from "@phosphor-icons/react";
import { Avatar, Button, Input } from "@/components/ui";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke<string>("greet", { name }));
  }

  return (
    <main className="min-h-full bg-dark-950 px-6 py-10 text-dark-50">
      <section className="mx-auto flex max-w-2xl flex-col gap-8 rounded-sm border border-dark-700 bg-dark-900/80 p-8 shadow-2xl shadow-black/30">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <Avatar.Fallback>K</Avatar.Fallback>
          </Avatar>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-dark-200">
              <SparkleIcon className="size-3.5" weight="bold" />
              kode-client
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Tailwind UI kit is wired up.
            </h1>
          </div>
        </div>

        <div className="grid gap-3 rounded-xs border border-dark-700 bg-dark-850 p-4 text-sm text-dark-100">
          <p className="flex items-center gap-2">
            <RocketLaunchIcon className="size-4 text-primary-300" weight="bold" />
            Components copied from kode-web.
          </p>
          <p className="flex items-center gap-2">
            <TerminalWindowIcon className="size-4 text-primary-300" weight="bold" />
            Phosphor icons and Tailwind v4 are available.
          </p>
        </div>

        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void greet();
          }}
        >
          <Input
            size="lg"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
            wrapperClassName="sm:flex-1"
          />
          <Button
            type="submit"
            size="lg"
            variant="primary"
            rightIcon={<RocketLaunchIcon className="size-4" weight="bold" />}
          >
            Greet
          </Button>
        </form>

        {greetMsg && (
          <p className="rounded-xs border border-dark-700 bg-dark-800 px-3 py-2 text-sm text-dark-100">
            {greetMsg}
          </p>
        )}
      </section>
    </main>
  );
}

export default App;
