import { Form, Link } from "@inertiajs/react";
import { Box, Button, Checkbox, FormControlLabel, Stack, TextField, Typography } from "@mui/material";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface PageTodosEditProps {
  todo: Todo;
  errors?: Record<string, string | string[]>;
}

export default function TodosEdit({ todo }: PageTodosEditProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 640, mx: "auto" }}>
      <Box sx={{ mb: 2 }}>
        <Button component={Link} href="/todos/" size="small">
          ← Back
        </Button>
      </Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Edit Todo #{todo.id}
      </Typography>
      <Form action={`/todos/${todo.id}/edit/`} method="post" setDefaultsOnSuccess>
        {({ processing }) => (
          <Stack spacing={2}>
            <TextField id="title" name="title" defaultValue={todo.title} label="Title" fullWidth />
            <FormControlLabel
              control={<Checkbox id="completed" name="completed" defaultChecked={todo.completed} />}
              label="Completed"
            />
            <Stack direction="row" spacing={2}>
              <Button type="submit" disabled={processing} variant="contained">
                Save
              </Button>
              <Button component={Link} href={`/todos/${todo.id}/delete/`} method="post" color="error">
                Delete
              </Button>
            </Stack>
          </Stack>
        )}
      </Form>
    </Box>
  );
}
