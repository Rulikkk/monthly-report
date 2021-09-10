import React from "react";
import { Button, EditorShadowedCard, Input } from "../BaseComponents";

function EmphasizeCaptionCheckbox({ info, onChange }) {
  const checkboxId = `emphasize-${info.id}`;

  return (
    <div className="flex flex-col justify-center items-center pl-2">
      <input
        type="checkbox"
        onClick={() => onChange(!info.emphasizeCaption)}
        defaultChecked={info.emphasizeCaption}
        id={checkboxId}
        name={checkboxId}
      />
      <label htmlFor={checkboxId} className="text-xs">
        Emph.
      </label>
    </div>
  );
}

export default function BenchEditorMainInfoCard({ info, index, onBenchInfoUpdate, onDelete }) {
  const getHandlerForField = (field) => (value) => {
    const newInfo = { ...info, [field]: value };
    onBenchInfoUpdate && onBenchInfoUpdate(newInfo, index);
  };

  return (
    <EditorShadowedCard>
      <div className="flex mb-2">
        <Input
          value={info.caption || ""}
          placeholder="Caption"
          onChange={getHandlerForField("caption")}
        />
        <EmphasizeCaptionCheckbox info={info} onChange={getHandlerForField("emphasizeCaption")} />
      </div>
      <Input
        className="mb-2"
        value={info.count || ""}
        placeholder="Count"
        onChange={getHandlerForField("count")}
      />
      <Input
        className="mb-2"
        value={info.info || ""}
        placeholder="Info"
        textarea
        onChange={getHandlerForField("info")}
      />
      <div className="flex flex-row-reverse">
        <Button small red onClick={() => onDelete(info)}>
          Delete
        </Button>
      </div>
    </EditorShadowedCard>
  );
}
