import { render, screen } from "@testing-library/react";

import CreditCardsIndex from "./Index";

describe("CreditCards/Index page", () => {
  it("renders heading and add form controls", () => {
    render(
      <CreditCardsIndex
        user={{ name: "Bob" }}
        page_cards={{
          has_previous: false,
          has_next: false,
          number: 1,
          num_pages: 1,
          results: [],
        }}
        errors={{}}
      />,
    );

    expect(screen.getByText(/Credit cards - Bob/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Add credit card/i })).toBeInTheDocument();
  });
});
