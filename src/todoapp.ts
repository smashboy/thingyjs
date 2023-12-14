import { Element } from "./lib/Element";
import { state } from "./lib/state";

interface Todo {
  description: string;
}

interface TodoState {
  todos: Todo[];
}

interface User {
  username: string;
}

const userStore = state<{ user: User | null }>({ user: null });

const WelcomeScreen = () => {
  const loginStore = state({ username: "" });

  const signin = () => {
    if (loginStore.username) {
      userStore.user = { username: loginStore.username };
    }
  };

  return Element("div")
    .styles({
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "10px",
    })
    .child(
      Element("input").listen(
        "input",
        (event) => (loginStore.username = event.target.value)
      )
    )
    .child(Element("button").listen("click", signin).child("Sign in"));
};

const UserTodosScreen = () => {
  const todosStore = state<TodoState>({ todos: [] });

  const logout = () => {
    console.log("SIGN OUT");
    userStore.user = null;
  };

  return Element("button").listen("click", logout).child("Sign out");
};

export const App = () => {
  return Element("div", userStore)
    .styles({
      width: "100dvw",
      height: "100dvh",
    })
    .child(() => (userStore.user ? UserTodosScreen() : WelcomeScreen()));
};
