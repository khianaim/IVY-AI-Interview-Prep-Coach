"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "@/components/FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

// Define the schema for the form
const authFormSchema = (type: "sign-up" | "sign-in") => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: "sign-up" | "sign-in" }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Form Submitted", values);

      if (type === 'sign-up') {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User Credentials:", userCredentials);

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success('Account created successfully. Please sign in.');
        router.push('/sign-in');
      } else {
        const { email, password } = values;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User Credential:", userCredential);

        const idToken = await userCredential.user.getIdToken();
        console.log("ID Token:", idToken);

        if (!idToken) {
          toast.error('Sign in failed.');
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success('Sign in successful.');
        console.log("Redirecting to dashboard...");
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`There was an error: ${error.message || error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="lg:min-w-[566px]">
      <div className="flex flex-col gap-6 py-14 px-10 -mt-5">

        <h3 className=" text-white text-base sm:text-lg md:text-xl font-bold flex flex-row items-center justify-center">Interview victory starts with IVY</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form info">
            {/* Conditionally render Name field for Sign-Up */}
            {!isSignIn && (
              <FormField control={form.control} name="name" label="Name" placeholder="Your name" className="sign"/>
            )}
            <FormField control={form.control} name="email" label="Email" placeholder="Your email address" type="email" className="sign" />
            <FormField control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" className="sign" />

            <div className="flex justify-center">
            <Button
            className="cursor-pointer glass-button w-full sm:w-fit bg-white/10 text-black font-semibold rounded-full px-4 py-1 text-base sm:text-lg md:text-xl border border-white/20 hover:bg-white/20 transition"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fde68a, #aecde6)",
              backgroundClip: "padding-box",
              border: `1px solid rgba(255, 255, 255, 0.2)`,
              boxShadow:
              `inset 0 0.05em 0 #ffffff0d,
                0 0.05em 0 #ffffff0a,
                0 0.1em 0 #ffffff0a,
                0 0.25em 0 #cccccc10,
                0 0.3em 0 #bbbbbb10,
                0 0.4em 0 #aaaaaa10,
                0 0.45em 0 #99999910,
                0 0.5em 0.5em #ffffff05`,
            }}
            type="submit"
          >
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
    </div>

          </form>
        </Form>

        <p className="text-center mt-3 ">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link href={!isSignIn ? "/sign-in" : "/sign-up"} className="font-semibold text-user-primary ml-1">
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
