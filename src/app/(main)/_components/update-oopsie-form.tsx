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
import { type UpdateOopsie, updateOopsieSchema } from "~/lib/validators";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type RouterOutputs, api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

export function UpdateOopsieForm({
  oopsie,
}: {
  oopsie: RouterOutputs["oopsie"]["getLatest"]["oopsies"][number];
}) {
  const form = useForm<UpdateOopsie>({
    resolver: zodResolver(updateOopsieSchema),
    defaultValues: {
      oopsieId: oopsie.id,
      description: oopsie.description,
      userId: oopsie.userId,
    },
  });

  const utils = api.useUtils();

  const updateOopsie = api.oopsie.update.useMutation({
    onSuccess: () => {
      toast.success("Oopsie updated!");
      void utils.oopsie.getLatest.invalidate();
    },
    onError: () => {
      toast.error("Failed to update oopsie");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          updateOopsie.mutate(values);
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

        <Button type="submit">Update Oopsie</Button>
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
          {user.username} ({user.firstName})
        </SelectItem>
      ))}
    </>
  );
}
