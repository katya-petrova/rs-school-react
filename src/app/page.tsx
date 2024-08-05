import MyApp from './app';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pokemon App',
};

export default async function Page() {
  return <MyApp />;
}
