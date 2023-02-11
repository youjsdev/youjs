import { Project } from '@youjs/core';
import { Page, ProjectData } from '@youjs/core/dist/types';
import { DataProvider, renderComponent } from '@youjs/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default class Builder extends Project {
  private components: {
    [name: string]: React.FunctionComponent<any>;
  };
  private wrapper: React.FunctionComponent<any>;

  constructor(
    _clientId: string,
    _apiKey: string,
    _wrapper: React.FunctionComponent<{
      data: ProjectData & { page: Page };
      children: React.ReactNode;
    }> = ({ children }) => <div>{children}</div>,
    _components: {
      [name: string]: React.FunctionComponent<any>;
    } = {},
  ) {
    super(_clientId, _apiKey);

    this.components = _components;
    this.wrapper = _wrapper;
  }

  public register = (name: string, component: React.FunctionComponent): React.FunctionComponent =>
    (this.components[name] = component);

  public getPage = (slug: string): Promise<ProjectData & { page: Page }> =>
    this.getProject().then(async (project) => {
      return {
        ...project,
        navbar: {
          ...project.navbar,
        },
        page: {
          ...project.pages[slug],
        },
      };
    });

  public getPages = (): Promise<
    {
      name: string;
      slug: string;
    }[]
  > =>
    this.getProject().then((project) => {
      return Object.values(project.pages ?? {}).map((page: any) => ({
        name: page.name,
        slug: page.slug,
      }));
    });

  public page = (_data: ProjectData & { page: Page }) => {
    const [data, setData] = useState(_data);
    const [content, setContent] = useState<any>();

    useEffect(() => {
      if (!data?.page?.content) return console.error('Page not found');
      Promise.all(
        Object.values(data.page.content ?? {})
          ?.sort((a: any, b: any) => {
            // sort least to greatest by index
            return a.index - b.index;
          })
          .map(async (element: any, index: number) => await renderComponent(element, this.components, index)),
      ).then((content) => setContent(content));
    }, [data]);

    useEffect(() => {
      setData(_data);
    }, [_data]);

    return (
      <DataProvider data={data}>
        <Head>
          <title>{`${data.page.name} | ${data.info.name}`}</title>
          <meta name="keywords" content={data.page.keywords}></meta>
          <meta name="description" content={data.page.description}></meta>
          <meta property="og:type" content="website" />
          <meta property="og:image" content={``} />
          <meta charSet="utf-8"></meta>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${data.info.analytics}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${data.info.analytics}', {
								page_path: window.location.pathname,
								});
							`,
            }}
          />
        </Head>
        <this.wrapper data={data}>{content}</this.wrapper>
      </DataProvider>
    );
  };

  public getStaticPaths = async () => ({
    paths: (await this.getPages()).map((page) => ({
      params: {
        slug: page.slug,
      },
    })),
    fallback: false,
  });

  public getStaticProps = async (context: { params: { slug: any } }) => ({
    props: await this.getPage(context.params.slug),
  });

  public revalidate = async (req: any, res: any) => {
    const project = await this.getProject();
    Promise.all(Object.keys(project.pages ?? {}).map(async (slug: string) => res.revalidate(`/${slug}`))).then(() => {
      res.json({ success: true, message: 'Revalidation complete', pages: Object.keys(project.pages ?? {}) });
    });
  };
}

export * from '@youjs/react';
