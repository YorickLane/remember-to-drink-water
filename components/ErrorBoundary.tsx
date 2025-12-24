/**
 * 全局错误边界组件
 * 捕获子组件的 JavaScript 错误并显示友好的错误界面
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Layout } from '@/constants/Layout';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.icon}>😥</Text>
          <Text style={styles.title}>出错了</Text>
          <Text style={styles.message}>
            {this.state.error?.message || '发生未知错误'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>重试</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.padding.screen,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 64,
    marginBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
    color: '#333',
  },
  message: {
    fontSize: Layout.fontSize.md,
    color: '#666',
    textAlign: 'center',
    marginBottom: Layout.spacing.xxl,
    paddingHorizontal: Layout.spacing.xl,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: Layout.spacing.xxl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  buttonText: {
    color: '#fff',
    fontSize: Layout.fontSize.md,
    fontWeight: '600',
  },
});

export default ErrorBoundary;
