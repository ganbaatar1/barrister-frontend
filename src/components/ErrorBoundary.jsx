
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center text-red-600">
          <h1 className="text-2xl font-bold mb-4">😢 Уучлаарай, системд алдаа гарлаа.</h1>
          <p>Хуудас ачаалж чадсангүй. Та дахин оролдоно уу.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
