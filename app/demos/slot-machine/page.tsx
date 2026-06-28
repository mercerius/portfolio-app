export default function SlotMachineDemoPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="flex gap-3 text-4xl select-none" aria-hidden="true">
          <span className="flex items-center justify-center w-16 h-20 rounded-xl border-2 border-border/60 bg-card text-3xl">
            🎰
          </span>
          <span className="flex items-center justify-center w-16 h-20 rounded-xl border-2 border-border/60 bg-card text-3xl">
            ？
          </span>
          <span className="flex items-center justify-center w-16 h-20 rounded-xl border-2 border-border/60 bg-card text-3xl">
            ？
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            slot_machine_api — live demo
          </p>
          <p className="text-lg font-black tracking-tight text-foreground">
            Coming Soon
          </p>
          <p className="text-xs/relaxed text-muted-foreground mt-1">
            The interactive demo is under construction. Check back once the API
            is wired up.
          </p>
        </div>
      </div>
    </div>
  );
}
