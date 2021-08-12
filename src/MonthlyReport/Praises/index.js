import React from "react";
import { Button, EditorShadowedCard, SingleImgButton } from "../BaseComponents";
import { Input } from "../Editor";

const PraiseEditor = ({ praise, updateReport, remove }) => (
  <EditorShadowedCard>
    <Input
      value={praise.text}
      afterChange={updateReport}
      onChange={(val) => (praise.text = val)}
      placeholder="Describe praise here"
      textarea
    />
    <div className="flex justify-end">
      <SingleImgButton
        onImage={(img) => {
          praise.img = img;
          updateReport();
        }}
        className="ml-2 text-white font-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-700 cursor-pointer select-none"
        title="Add image"
        dragTitle="DROP HERE"
      />
      <Button small red className="ml-1" onClick={remove}>
        Remove
      </Button>
    </div>
  </EditorShadowedCard>
);

const emptyFunc = () => {};

const PraiseEditorGroup = ({ report, updateReport = emptyFunc }) =>
  !report ? (
    "Loading"
  ) : (
    <>
      <h1 className="text-xl m-2">Praises</h1>
      <Button
        small
        className="ml-2"
        onClick={() => {
          if (!report.praises) report.praises = [];
          report.praises.unshift({ text: "" });
          updateReport();
        }}
      >
        Add praise
      </Button>
      {report.praises &&
        report.praises.map((p, i) => (
          <PraiseEditor
            key={i}
            praise={p}
            updateReport={updateReport}
            remove={() => {
              report.praises = report.praises.filter((x) => x !== p);
              updateReport();
            }}
          />
        ))}
    </>
  );

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
