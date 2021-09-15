import debounce from "lodash.debounce";
import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { updateBenchOrPraises } from "../../../../store/api";
import { usePraisesDataState } from "../../../../store/hooks";
import { Button, EditorShadowedCard, SingleImgButton, Input } from "../BaseComponents";

const PraiseEditor = ({ praise, onPraiseUpdate, onPraiseRemove }) => (
  <EditorShadowedCard>
    <Input
      value={praise.text}
      onChange={(val) => onPraiseUpdate({ ...praise, text: val })}
      placeholder="Describe praise here"
      textarea
    />
    <div className="flex justify-end">
      <SingleImgButton
        onImage={(img) => onPraiseUpdate({ ...praise, img })}
        className="ml-2 text-white font-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-700 cursor-pointer select-none"
        title="Add image"
        dragTitle="DROP HERE"
      />
      <Button small red className="ml-1" onClick={onPraiseRemove}>
        Remove
      </Button>
    </div>
  </EditorShadowedCard>
);

const PraiseEditorGroup = () => {
  const { reportId } = useParams();
  const [praises, setPraises] = usePraisesDataState();

  const getAPIPayload = (praises) => ({
    praises: praises.map((p) => ({ text: p.text, image: p.img })),
  });

  const savePraisesUpdates = useCallback(
    (payload) => updateBenchOrPraises(reportId, payload),
    [reportId],
  );

  const savePraisesUpdatesDebounced = useCallback(debounce(savePraisesUpdates, 300), [
    savePraisesUpdates,
  ]);

  const addNewPraise = () => {
    const updated = [{ text: "" }, ...(praises || [])];
    setPraises(updated);
    savePraisesUpdates(getAPIPayload(updated));
  };

  const onPraiseRemove = (idx) => () => {
    const updated = praises.filter((_, i) => idx !== i);
    setPraises(updated);
    savePraisesUpdates(getAPIPayload(updated));
  };

  const onPraiseUpdated = (idx) => (updatedPraise) => {
    const updated = praises.map((p, i) => (idx === i ? updatedPraise : p));
    setPraises(updated);
    savePraisesUpdatesDebounced(getAPIPayload(updated));
  };

  return !praises ? (
    "Loading"
  ) : (
    <div className="pb-2 flex-auto flex-col">
      <h1 className="text-xl m-2">Praises</h1>
      <Button small className="ml-2" onClick={addNewPraise}>
        Add praise
      </Button>
      {praises &&
        praises.map((p, i) => (
          <PraiseEditor
            key={i}
            praise={p}
            onPraiseUpdate={onPraiseUpdated(i)}
            onPraiseRemove={onPraiseRemove(i)}
          />
        ))}
    </div>
  );
};

const Praise = ({ praise: { img, text } }) => (
  <li className="mb-8">
    <EditorShadowedCard>
      <h2 className="text-xl ml-4 py-2">{text}</h2>
      <hr />
      {img && <img src={img} alt={text} />}
    </EditorShadowedCard>
  </li>
);

const Praises = ({ praises }) => (
  <>
    <h1 className="text-3xl mt-5">Praises</h1>
    {praises && praises.length > 0 ? (
      <ol>
        {praises.map((p, i) => (
          <Praise key={i} praise={p} />
        ))}
      </ol>
    ) : (
      "No outstanding praises were received from clients during this reporting month."
    )}
  </>
);

export { Praises, PraiseEditorGroup };
