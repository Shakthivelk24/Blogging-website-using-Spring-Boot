import {
  describe,
  test,
  expect,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import IndexPage from "./IndexPage";


// ==========================================
// MOCK ALLPOST
// ==========================================

vi.mock("./AllPost", () => ({
  default: () => (
    <div data-testid="all-post">
      All Posts
    </div>
  ),
}));


// ==========================================
// TESTS
// ==========================================

describe("IndexPage Component", () => {

  test("renders AllPost component", () => {

    render(
      <IndexPage />
    );

    expect(
      screen.getByTestId("all-post")
    ).toBeInTheDocument();

  });

});