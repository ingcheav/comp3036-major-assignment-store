import { CreateScreen } from "../../../components/CreateScreen";
import { LoginScreen } from "../../../components/LoginScreen";
import { isLoggedIn } from "../../../utils/auth";

// Server component: checks authentication before showing the create form.
export default async function CreatePostPage() {
  // isLoggedIn reads the JWT cookie on the server.
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-gray-100 p-5">
        <LoginScreen />
      </main>
    );
  }

  return <CreateScreen />;
}
