import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import CreatePostPage from './pages/CreatePostPage';
import UpdatePostPage from './pages/UpdatePostPage';
import PostPage from './pages/PostPage';
import ErrorPage from './pages/ErrorPage';
import MyAccountPage from './pages/MyAccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthorPage from './pages/AuthorPage';
import EditProfilePage from './pages/EditProfilePage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { 
        element: <ProtectedRoute />,
        children: [
          { path: 'my-account', element: <MyAccountPage /> },
          { path: 'my-account/edit', element: <EditProfilePage /> },
          { path: 'posts/create', element: <CreatePostPage /> },
          { path: 'posts/:id/edit', element: <UpdatePostPage /> },
        ]
      },
      { path: 'posts/:id', element: <PostPage /> },
      { path: 'author/:authorId', element: <AuthorPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);