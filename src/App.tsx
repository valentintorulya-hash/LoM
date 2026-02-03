import { Component, type ErrorInfo, type ReactNode } from 'react';
// import DevDashboard from './components/DevDashboard';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from './components/ui/Toast';
import { useToastStore } from './store/toastStore';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-900 text-white min-h-screen">
          <h1 className="text-3xl font-bold mb-4">CRASH DETECTED</h1>
          <pre className="bg-black p-4 rounded overflow-auto">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="App">
      <ErrorBoundary>
        <MainLayout />
        <Toaster toasts={toasts} onClose={removeToast} />
      </ErrorBoundary>
    </div>
  );
}

export default App;