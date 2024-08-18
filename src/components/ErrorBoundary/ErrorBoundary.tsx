import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<Props> {
  state: {
    errorMessage: string;
  } = {
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { errorMessage: error.toString() };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (this.state.errorMessage) {
      return <p>{this.state.errorMessage}</p>;
    }
    return this.props.children;
  }
}
