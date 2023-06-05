import { Project } from '@youjs/core';
import { Page, ProjectData } from '@youjs/core/dist/types';
import { DataProvider, renderComponent } from '@youjs/react';
import Head from 'next/head';
import Script from 'next/script';
import PasswordProtected from './components/PasswordProtected';
// import { useEffect, useState } from 'react';

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
        name: page?.name,
        slug: page?.slug,
      }));
    });

  public page = (_data: ProjectData & { page: Page }) => {
    const content = Object.values(_data?.page?.content ?? {})
      ?.sort((a: any, b: any) => {
        return a.index - b.index;
      })
      .map((element: any, index: number) => renderComponent(element, this.components, _data?.info?.theme, index));

    return (
      <DataProvider data={_data}>
        <Head>
          <title>{`${_data?.page?.name} | ${_data?.info?.name}`}</title>
          <meta name="keywords" content={_data?.page?.keywords}></meta>
          <meta name="description" content={_data?.page?.description}></meta>
          <meta property="og:type" content="website" />
          <meta property="og:image" content={``} />
          <meta charSet="utf-8"></meta>
        </Head>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${_data?.info?.analytics}`} />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${_data?.info?.analytics}', {
								page_path: window.location.pathname,
								});
							`,
          }}
        />
        {_data?.info?.password?.enabled && (
          <PasswordProtected password={_data?.info?.password?.password} {..._data?.info?.theme} />
        )}
        <this.wrapper data={_data}>{content}</this.wrapper>
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

  public getStaticProps = async (context: { params: { slug: any } }) => {
    const props = await this.getPage(context.params.slug);

    if (!props.page)
      return {
        notFound: true,
      };

    return {
      props,
    };
  };

  public revalidate = async (req: any, res: any) => {
    const project = await this.getProject();
    Promise.all(Object.keys(project.pages ?? {}).map(async (slug: string) => res.revalidate(`/${slug}`))).then(() => {
      res.json({ success: true, message: 'Revalidation complete', pages: Object.keys(project.pages ?? {}) });
    });
  };
}

export * from '@youjs/react';
