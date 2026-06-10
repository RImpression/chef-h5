import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loading } from './components/Loading';
import { HomePage } from './pages/HomePage';

const SearchResultPage = lazy(() =>
  import('./pages/SearchResultPage').then((m) => ({ default: m.SearchResultPage }))
);
const CategoryPage = lazy(() =>
  import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage }))
);
const RecipePage = lazy(() =>
  import('./pages/RecipePage').then((m) => ({ default: m.RecipePage }))
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
