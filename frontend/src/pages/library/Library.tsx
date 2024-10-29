import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SearchIcon from "../../components/icons/Search";
import { MotionCanvasPlayer } from "../../components/MotionCavasPlayer";

export default function Library() {
  const code = hardCode; 
  const pRef = useRef<HTMLDivElement>(null);
  const preview = true;

  return (
    <div className="md:flex">
      <div className="basis-1/4">
        <div className="pe-3">
          <div>
            <form action="/search" className="max-w-[480px] w-full">
              <div className="relative">
                <input type="text" name="q" className="w-full border h-8 shadow p-4 rounded-full dark:text-gray-800 dark:border-gray-700 dark:bg-gray-200" placeholder="search" />
                <button type="submit">
                  <SearchIcon classString="text-teal-400 h-4 w-4 absolute top-2.5 right-3 fill-current dark:text-teal-300" />
                </button>
              </div>
            </form>
          </div>

          <div className="pt-5">
            <h3 className="font-bold text-gray-500">
              Components
            </h3>
            <div>
              <div className="flex justify-center">
                VScode
              </div>
              <div className="flex justify-center">
                Window
              </div>
              <div className="flex justify-center">
                Camera
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="grow pt-5 pl-5 min-w-0">
        <h2 className="font-bold text-xl"> VSCode</h2>
        <p className="text-gray-500">
          A visual studio code animation and abilities
        </p>

        <div>
          <div className="border-b border-gray-200 flex gap-3">
            <p className={`px-3 ${preview ? "border-b border-black font-bold" : ""}`}>
              Preview
            </p>
            <p className={`px-3 ${!preview ? "border-b border-black font-bold" : ""}`}>
              Code
            </p>
          </div>

          <div ref={pRef} className="w-full">
             <MotionCanvasPlayer code={code} /> 
          </div>
        </div>

      </div>
    </div>
  )
}

const hardCode = `
import { Img, JSX, Layout, Line, Rect, Code, RectProps, Txt, is, makeScene2D } from "@motion-canvas/2d";
import { ThreadGenerator, all, createRef, makeRef, range, waitFor, createRefArray } from "@motion-canvas/core";


export function Paper({
  children,
  flip,
  ...props
}: RectProps & {flip?: boolean}) {
  const lines = createRefArray<Line>();
  const paper = (
    <Rect radius={8} {...props} cache>
      <Line
        compositeOperation={'destination-out'}
        layout={false}
        ref={lines}
        points={[
          [0, 40],
          [flip ? -40 : 40, 40],
          [flip ? -40 : 40, 0],
        ]}
        lineWidth={8}
        stroke={'white'}
        radius={8}
      />
      <Line
        compositeOperation={'destination-out'}
        layout={false}
        ref={lines}
        points={[[0, 40], 0, [flip ? -40 : 40, 0]]}
        fill={'white'}
        closed
      />
      {children}
    </Rect>
  ) as Rect;

  lines.forEach(l =>
    l.position(flip ? paper.size().mul([0.5, -0.5]) : paper.size().scale(-0.5)),
  );

  return paper;
}


type FolderTree = {
  name: string,
  children?: FolderTree[],
  isFile?: boolean,
}

export interface VSCodeProps extends RectProps {
  sideBarTree: FolderTree,
}

export class VSCode extends Rect {
  private sidebarLayoutsRefs: { [key: string]: Rect } = {};
  public readonly terminal: Layout;
  public readonly activeTerminalLine: Layout;

  public constructor({ sideBarTree, children, ...props }: VSCodeProps) {
    super({
      layout: true,
      ...props,
      fill: "#2b2b2b",
      padding: 0,
      gap: 3
    });

    this.add(
      <>
        <Rect
          width={"20%"}
          fill={"#181818"}
          height={"100%"}
          paddingLeft={10}
          paddingTop={10}
          direction={"column"}
        >
          
          <VSCodeSideBar sidebarTree={sideBarTree} key="" refs={this.sidebarLayoutsRefs} />
        </Rect>
        <Rect
          width={"80%"}
          layout
          direction={"column"}
          height={"100%"}
          fill={"black"}
        >
          <Rect
            fill={"#1f1f1f"}
            width={"100%"}
            height={"70%"}
          >
            {children}
          </Rect>
          <Rect fill={"#181818"} height={"30%"} layout direction={"column"}>
            <Layout padding={10} gap={25} height={"15%"}>
              <Rect>
                <Txt fontSize={20} fill={"white"}>PROBLEMS</Txt>
              </Rect>
              <Rect>
                <Txt fontSize={20} fill={"white"}>DEBUG CONSOLE</Txt>
              </Rect>
              <Rect layout fill={"lightblue"}>
                <Rect width={"102%"} height={"95%"} fill={"#181818"}>
                  <Txt fontSize={20} fill={"white"}>TERMINAL</Txt>
                </Rect>
              </Rect>
              <Rect>
                <Txt fontSize={20} fill={"white"}>PORTS</Txt>
              </Rect>
            </Layout>
            <Layout height={"85%"} padding={10} paddingTop={10} ref={makeRef(this, 'terminal')} direction={"column"}>

              <Layout gap={10} ref={makeRef(this, "activeTerminalLine")}>
                <Txt fill={"white"} fontSize={15} text="C:\\Users\\Lenovo\\Documents\\test\\ramen>   " />
                <Txt fill={"yellow"} fontSize={15} text="" />
              </Layout>
              {
                range(6).map(() => (
                  <Layout>
                    <Txt fill={"white"} fontSize={18} text="" />
                  </Layout>
                ))
              }

            </Layout>
          </Rect>
        </Rect>
      </>
    )
  }

  * writeToTerminal(content: string, time: number): ThreadGenerator {
    const layout = this.terminal.findFirst<Layout>(is(Layout));
    const txt = layout.findLast(is(Txt));
    yield* txt.text(\`\${txt.text()}\${content}\`, time);
  }

  * submitToTerminal(content: string, time: number): ThreadGenerator {
    yield* this.writeToTerminal(content, time);
    const txts = this.terminal.findAll(is(Txt));
    yield* all(
      ...txts.slice(2).map(tx => tx.text(".", time / 2))
    )
  
    yield* waitFor(1);
    yield* all(
      ...txts.slice(1).map(tx => tx.text("", time / 2))
    )
  }

  * addFileTo(folder: string, fileName: string, time: number): ThreadGenerator {
    if (folder[0] !== "/") folder = \`/\${folder}\`;
    const folderRect = this.sidebarLayoutsRefs[folder];
    folderRect.add(
      <VSCodeSideBar sidebarTree={{ name: fileName, isFile: true }} key={folder} refs={this.sidebarLayoutsRefs} />
    )
    yield* this.sidebarLayoutsRefs[\`\${folder}/\${fileName}\`].findFirst<Rect>(is(Rect)).fill("lightgreen", time).back(time)
  }

  * highlightTree(id: string, time: number): ThreadGenerator {
    if (id[0] !== "/") id = \`/\${id}\`;

    yield* this.sidebarLayoutsRefs[id].findFirst<Rect>(is(Rect)).fill("lightgray", time).back(time);
  }
}

interface VSCodeSideBarProp {
  sidebarTree: FolderTree
  key: string
  refs: { [key: string]: Layout }
}

function VSCodeSideBar({sidebarTree, key, refs }: VSCodeSideBarProp): JSX.Element {
  const currentKey = \`\${key}/\${sidebarTree.name}\`;
  return (
    <Rect ref={makeRef(refs, currentKey)} layout direction={"column"} paddingLeft={20}>
      <Rect layout gap={10} paddingTop={10} paddingBottom={10}>
        <Layout gap={5}>
          <Txt fontSize={14} fill={"white"}>{sidebarTree.name}</Txt>
        </Layout>
      </Rect>
      {
        sidebarTree.children?.length &&
        <>
          {
            sidebarTree.children.map(t => <VSCodeSideBar sidebarTree={t} key={currentKey} refs={refs} />)
          }
        </>
      }
    </Rect>
  )
}

export default makeScene2D(function* (view) {
    const node = createRef<VSCode>();
    const codeRef = createRef<Code>();
    view.add(  <VSCode
      ref={node}
      sideBarTree={
        {
          name: "Ramen",
          children: [
            {
              name: "app",
              children: [
                {
                  name: "model"
                }
              ]
            },
            {
              name: "config",
              children: [
                {
                  name: "initializers",
                  children: [
                    {
                      name: "file.rb",
                      isFile: true
                    }
                  ]
                },
                {
                  name: "routes.rb",
                  isFile: true
                }
              ]
            },
            {
              name: "db",
              children: [
                {
                  name: "migrations",
                  children: [
                    {
                      name: "2094043095_create_user.rb",
                      isFile: true
                    }
                  ]
                }
              ]
            },
            {
              name: "Gemfile",
              isFile: true
            }
          ]
        }}
      height={() => view.height()}
      width={() => view.width()}
    >
        <Rect padding={10} paddingTop={5}>
        <Paper>
            <Code
          ref={codeRef}
          fontSize={20}
          offsetX={-1}
          x={-400}
          code={"m,m"}

        />
        </Paper>
        
      </Rect>
    </VSCode>);
    yield* node().writeToTerminal("show", 2)
  })
`