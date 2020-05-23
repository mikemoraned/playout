import { storeFor } from "./store";
import { teamFor, teamsFor } from "./team";

export function testStore() {
  const store = storeFor(
    teamsFor(
      [teamFor("A", 2), teamFor("B", 3)]
      //       templateFor(["A", "B", "C"], defaultSize, maximumSize)
    )
    //     gridFor(2, 2)
  );
  return store;
}
