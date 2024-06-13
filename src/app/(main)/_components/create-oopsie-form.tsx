import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type OopsieForm, oopsieFormSchema } from "~/lib/validators";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useEffect } from "react";

export function CreateOopsieForm() {
  const form = useForm<OopsieForm>({
    resolver: zodResolver(oopsieFormSchema),
    defaultValues: {
      description: "",
      userId: "",
    },
  });

  // Get longitude and latitude from browser
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        form.setValue("latitude", position.coords.latitude.toString());
        form.setValue("longitude", position.coords.longitude.toString());
      });
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, [form]);

  const utils = api.useUtils();

  const createOopsie = api.oopsie.create.useMutation({
    onSuccess: () => {
      toast.success("Oopsie created!");
      void utils.oopsie.getLatest.invalidate();
    },
    onError: () => {
      toast.error("Failed to create oopsie");
    },
    onSettled: () => {
      form.reset();
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          createOopsie.mutate({
            ...values,
            imageUrl: "https://picsum.photos/1920/1080",
          });
        })}
      >
        <div className="mb-4 space-y-2">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Who?</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      <UsersList />
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Create Oopsy</Button>
      </form>
    </Form>
  );
}

function UsersList() {
  const { data, isPending, isError } = api.user.all.useQuery();

  if (isPending) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      {data.map((user) => (
        <SelectItem key={user.id} value={user.id}>
          {user.username}
        </SelectItem>
      ))}
    </>
  );
}
