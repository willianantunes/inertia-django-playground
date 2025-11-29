import { Form, Link, usePage } from "@inertiajs/react";
import { Box, Button, Stack, TextField, Typography, Alert } from "@mui/material";

interface Message {
  message: string;
  level_tag: "error" | "warning" | "info" | "success";
}

interface PageLoginProps {
  messages?: Message[];
  [key: string]: any;
}

export default function Login() {
  const { props } = usePage<PageLoginProps>();
  const messages = props?.messages || [];

  return (
    <Box sx={{ maxWidth: 480, width: "100%", mx: "auto" }}>
      <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
        Sign in
      </Typography>
      <Form action="/auth/login/" method="post">
        {({ processing, errors }) => (
          <Stack spacing={2}>
            {messages?.length > 0 && (
              <Stack spacing={1}>
                {messages.map((msg, idx) => (
                  <Alert
                    key={idx}
                    severity={["error", "warning", "info", "success"].includes(msg.level_tag) ? msg.level_tag : "info"}
                  >
                    {msg.message}
                  </Alert>
                ))}
              </Stack>
            )}
            {errors?.__all__ && (
              <Alert severity="error">
                {Array.isArray(errors.__all__)
                  ? errors.__all__.map((e, i) => <span key={i}>{String(e)} </span>)
                  : String(errors.__all__)}
              </Alert>
            )}
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              required
              error={Boolean(errors.email)}
              helperText={errors.email ? String(errors.email) : ""}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              required
              error={Boolean(errors.password)}
              helperText={errors.password ? String(errors.password) : ""}
              fullWidth
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Button type="submit" variant="contained" disabled={processing}>
                {processing ? "Signing in..." : "Sign in"}
              </Button>
              <Button component={Link} href="/" size="small">
                Back to home
              </Button>
            </Stack>
          </Stack>
        )}
      </Form>
    </Box>
  );
}
