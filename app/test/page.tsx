export default function Test() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-12 rounded-2xl bg-card shadow-soft text-foreground">
        <h2 className="text-3xl font-bold text-primary mb-4">Test kleuren</h2>
        <p className="text-muted-foreground mb-4">
          Dit moet een subtiele kleur zijn.
        </p>
        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg">Test knop</button>
      </div>
      <button className="bg-gradient-primary text-primary-foreground rounded-lg px-6 py-3 shadow-soft">
        Button tekst
      </button>
      <div className="bg-card text-card-foreground rounded-lg shadow-soft p-6">
        <h2 className="text-primary text-2xl font-bold mb-2">Receptnaam</h2>
        <p className="text-muted-foreground mb-4">Korte omschrijving</p>
        <button className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg shadow-medium">
          Voeg toe
        </button>
      </div>
      <div className="bg-gradient-accent rounded-lg shadow-soft p-4 flex flex-col items-center">
        <span className="text-2xl mb-2">🍽️</span>
        <h3 className="text-primary text-lg font-bold mb-1">Feature titel</h3>
        <p className="text-muted-foreground text-sm text-center">Uitleg van de feature</p>
      </div>
      <section className="bg-gradient-secondary py-16 rounded-2xl shadow-medium mb-8">
        <div className="container mx-auto px-4">
          blablabla
        </div>
      </section>
    </div>
  );
}
