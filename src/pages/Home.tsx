import { useTheme } from "../contexts/darkmode";

const Home = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to React TypeScript Starter
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          A modern React application with TypeScript, Tailwind CSS, and more.
        </p>

        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setTheme("light")}
              className={`px-4 py-2 rounded-md ${
                theme === "light"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Light Theme
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Dark Theme
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Features Included:</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">React Query</h3>
                <p className="text-sm text-muted-foreground">
                  Server state management
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">React Hook Form</h3>
                <p className="text-sm text-muted-foreground">
                  Form handling with validation
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Tailwind CSS</h3>
                <p className="text-sm text-muted-foreground">
                  Utility-first CSS framework
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">TypeScript</h3>
                <p className="text-sm text-muted-foreground">
                  Type-safe development
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Vite</h3>
                <p className="text-sm text-muted-foreground">Fast build tool</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">UI Components</h3>
                <p className="text-sm text-muted-foreground">
                  Radix UI & shadcn/ui
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
