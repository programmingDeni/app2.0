//importiere UI und Presenter
import MachineListLazyUI from "./MachineListLazyUI";

import useMachineListLazyPresenter from "./useMachineListLazyPresenter";

export default function MachineListLazyView() {
  const { machines, loading, error, removeMachine } =
    useMachineListLazyPresenter();

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>Fehler: {error.message}</p>;

  return (
    <div>
      <h4>ListenKomponente View </h4>
      <MachineListLazyUI machines={machines} onremoveMachine={removeMachine} />
    </div>
  );
}
