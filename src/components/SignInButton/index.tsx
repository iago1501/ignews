import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";

export function SignInButton() {

  const {data: {user}, status} = useSession()  

  const isUserLoggedIn = status === "authenticated";

  return isUserLoggedIn ? (
    <button type="button" className={styles.signInButton} onClick={ () => signOut()}>
      <FaGithub color="#04d361" />
      {user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
}
