import React from "react";

import { Input } from "./Editor";
import { EditorShadowedCard, Button } from "./BaseComponents";

function EmphasizeCaptionCheckbox({ info, onBenchInfoUpdate }) {
  const checkboxId = `emphasize-${info.id}`;

  return (
    <div className="flex flex-col justify-center items-center pl-2">
      <input
        type="checkbox"
        onClick={() => {
          info.emphasizeCaption = !info.emphasizeCaption;
          onBenchInfoUpdate && onBenchInfoUpdate();
        }}
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

export default function BenchEditorMainInfoCard({
  info,
  onBenchInfoUpdate,
  onDelete
}) {
  const getHandlerForField = field => value => {
    info[field] = value;
    onBenchInfoUpdate && onBenchInfoUpdate();
  };

  return (
    <EditorShadowedCard>
      <div className="flex mb-2">
        <Input
          value={info.caption}
          placeholder="Caption"
          onChange={getHandlerForField("caption")}
        />
        <EmphasizeCaptionCheckbox {...{ info, onBenchInfoUpdate }} />
      </div>

      <Input
        className="mb-2"
        value={info.count}
        placeholder="Count"
        onChange={getHandlerForField("count")}
      />

      <Input
        className="mb-2"
        value={info.info}
        placeholder="Info"
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
