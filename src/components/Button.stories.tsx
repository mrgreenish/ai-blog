import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Button",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    label: "Button",
    variant: "secondary",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    label: "Small Button",
    variant: "primary",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    label: "Large Button",
    variant: "primary",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Button",
    variant: "primary",
    disabled: true,
  },
};
