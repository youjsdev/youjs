import { Project as CoreProject } from '@youjs/core';
import { Page as PageData, ProjectData } from '@youjs/core/dist/types';
import { DataProvider, renderComponent } from '@youjs/react';
import Head from 'next/head';
import Meta from './Meta';
import React = require('react');

const Page = (getProject: () => Promise<ProjectData>) => {
  class Page extends React.Component<
    ProjectData & {
      page: PageData;
      wrapper: React.FC<{
        data: ProjectData;
        children: React.ReactNode;
      }>;
      components: {
        [key: string]: React.FunctionComponent;
      };
    }
  > {
    render() {
      const data = this.props;

      return (
        <DataProvider data={data}>
          <Head>
            <title>{`${data.page.name} | ${data.info.name}`}</title>
            <Meta id={data.info.analytics} url={data.info.url} {...data.page} />
          </Head>
          <this.props.wrapper data={data}>
            {Object.values(data.page.content)
              .sort((a: any, b: any) => {
                // sort least to greatest by index
                return a.index - b.index;
              })
              .map((c: any, key: number) => renderComponent(c, this.props.components, key))}
          </this.props.wrapper>
        </DataProvider>
      );
    }

    static async getStaticPaths() {
      const project = await getProject();

      return {
        paths: project.pages.map((page) => ({
          params: {
            slug: page.slug,
          },
        })),
        fallback: 'blocking',
      };
    }

    static async getStaticProps() {
      const project = await getProject();

      return {
        props: {} as ProjectData,
      };
    }
  }

  return Page;
};

export class Project extends CoreProject {
  constructor(projectId: string, apiKey: string) {
    super(projectId, apiKey);
  }

  async getProject() {
    const result = await super.getProject();
    return result;
  }

  Page() {
    return Page(this.getProject);
  }
}
