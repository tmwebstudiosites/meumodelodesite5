import { render } from "@testing-library/react";
import { MotionConfig } from "motion/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

/** Render com Router em memória e animações desligadas (testes determinísticos). */
export function renderWithRouter(ui: ReactElement, route = "/") {
  return render(
    <MotionConfig reducedMotion="always">
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </MotionConfig>,
  );
}
