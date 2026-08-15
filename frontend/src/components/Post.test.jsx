import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import Post from "./Post";

const mockPost = {
  id: 1,
  title: "My First Blog Post",
  content:
    "This is a sample blog post containing more than eighty characters so that we can test the Read More functionality properly.",
  author: "shakthi",
};

describe("Post Component", () => {

  // ==========================================
  // BASIC RENDERING
  // ==========================================

  test("renders post title", () => {

    render(<Post Post={mockPost} />);

    expect(
      screen.getByText("My First Blog Post")
    ).toBeInTheDocument();

  });


  test("renders author name", () => {

    render(<Post Post={mockPost} />);

    expect(
      screen.getByText("shakthi")
    ).toBeInTheDocument();

  });


  test("renders author initial", () => {

    render(<Post Post={mockPost} />);

    expect(
      screen.getByText("S")
    ).toBeInTheDocument();

  });


  // ==========================================
  // CONTENT
  // ==========================================

  test("shows shortened content initially", () => {

    render(<Post Post={mockPost} />);

    const content = mockPost.content;

    const shortText =
      content.slice(0, 80) + "...";

    expect(
      screen.getByText(shortText)
    ).toBeInTheDocument();

  });


  test("shows Read More button for long content", () => {

    render(<Post Post={mockPost} />);

    expect(
      screen.getByRole("button", {
        name: "Read More",
      })
    ).toBeInTheDocument();

  });


  // ==========================================
  // READ MORE
  // ==========================================

  test("shows full content after clicking Read More", () => {

    render(<Post Post={mockPost} />);

    const button =
      screen.getByRole("button", {
        name: "Read More",
      });

    fireEvent.click(button);

    expect(
      screen.getByText(mockPost.content)
    ).toBeInTheDocument();

  });


  test("changes button to Show Less after clicking Read More", () => {

    render(<Post Post={mockPost} />);

    const button =
      screen.getByRole("button", {
        name: "Read More",
      });

    fireEvent.click(button);

    expect(
      screen.getByRole("button", {
        name: "Show Less",
      })
    ).toBeInTheDocument();

  });


  // ==========================================
  // SHOW LESS
  // ==========================================

  test("shows shortened content after clicking Show Less", () => {

    render(<Post Post={mockPost} />);

    const readMoreButton =
      screen.getByRole("button", {
        name: "Read More",
      });

    fireEvent.click(readMoreButton);

    const showLessButton =
      screen.getByRole("button", {
        name: "Show Less",
      });

    fireEvent.click(showLessButton);

    const shortText =
      mockPost.content.slice(0, 80) + "...";

    expect(
      screen.getByText(shortText)
    ).toBeInTheDocument();

  });


  // ==========================================
  // SHORT CONTENT
  // ==========================================

  test("does not show Read More for short content", () => {

    const shortPost = {
      id: 2,
      title: "Short Post",
      content: "This is a short post.",
      author: "shakthi",
    };

    render(<Post Post={shortPost} />);

    expect(
      screen.queryByRole("button", {
        name: "Read More",
      })
    ).not.toBeInTheDocument();

  });


  // ==========================================
  // EMPTY CONTENT
  // ==========================================

  test("handles missing content", () => {

    const postWithoutContent = {
      id: 3,
      title: "Post Without Content",
      author: "shakthi",
    };

    render(
      <Post Post={postWithoutContent} />
    );

    expect(
      screen.getByText("Post Without Content")
    ).toBeInTheDocument();

  });


  // ==========================================
  // MISSING AUTHOR
  // ==========================================

  test("shows Unknown User when author is missing", () => {

    const postWithoutAuthor = {
      id: 4,
      title: "Unknown Author Post",
      content: "Some content",
    };

    render(
      <Post Post={postWithoutAuthor} />
    );

    expect(
      screen.getByText("Unknown User")
    ).toBeInTheDocument();

  });


  test("shows U as default author initial", () => {

    const postWithoutAuthor = {
      id: 5,
      title: "Unknown Author",
      content: "Some content",
    };

    render(
      <Post Post={postWithoutAuthor} />
    );

    expect(
      screen.getByText("U")
    ).toBeInTheDocument();

  });

});