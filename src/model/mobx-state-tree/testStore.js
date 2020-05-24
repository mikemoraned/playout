import { storeFor } from "./store";
import { teamFor, teamsFor, templateFor } from "./team";

export function testStore() {
  const defaultSize = 3;
  const maximumSize = 4;
  const store = storeFor(
    teamsFor(
      [teamFor("A", 2, maximumSize), teamFor("B", 3, maximumSize)],
      templateFor(["A", "B", "C"], defaultSize, maximumSize)
    )
    //     gridFor(2, 2)
  );
  return store;
}
