import { Project } from '@youjs/core';
import { Page, ProjectData } from '@youjs/core/dist/types';
import { DataProvider, renderComponent } from '@youjs/react';
import Head from 'next/head';
import Script from "next/script";
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
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
      if (!document) return;

      setPassword(getCookie('password') ?? '');
    }, []);

    useEffect(() => {
      if (!data?.page?.content) return console.error('Page not found');
      Promise.all(
        Object.values(data.page.content ?? {})
          ?.sort((a: any, b: any) => {
            // sort least to greatest by index
            return a.index - b.index;
          })
          .map(
            async (element: any, index: number) =>
              await renderComponent(element, this.components, data.info.theme, index),
          ),
      ).then((content) => setContent(content));
    }, [data]);

    useEffect(() => {
      setData(_data);
    }, [_data]);

    function getCookie(name: string) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let c of ca) {
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }

    function setCookie(name: string, value: string, days: number) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    if (data?.info?.password?.enabled && password !== data?.info?.password?.password) {
      return (
        <div
          style={{
            width: '100vw',
            height: '100vh',
          }}
        >
          <style>
            {`
          .formContainer {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          form {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            border: 1px solid #000;
            border-radius: 5px;
          }
          input {
            width: 100%;
            padding: 10px;
            border: 1px solid #000;
            border-radius: 5px;
            margin-bottom: 10px;
          }
          button {
            width: 100%;
            padding: 10px;
            border: 1px solid #000;
            border-radius: 5px;
            background-color: #000;
            color: #fff;
            cursor: pointer;
          }
        `}
          </style>
          <div className="formContainer">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const _password = prompt('Enter password') ?? getCookie('password') ?? '';

                setCookie('password', _password, 1);

                if (_password !== data?.info?.password?.password) {
                  alert('Incorrect password');
                } else {
                  setPassword(_password);
                }
              }}
            >
              <p>
                This site is password protected. Please enter the password to view the site. If you do not have the
                password, please contact the site owner.
              </p>
              <button type="submit">Enter Password</button>
            </form>
          </div>
        </div>
      );
    } else
      return (
        <DataProvider data={data}>
          <Head>
            <title>{`${data.page.name} | ${data.info.name}`}</title>
            <meta name="keywords" content={data.page.keywords}></meta>
            <meta name="description" content={data.page.description}></meta>
            <meta property="og:type" content="website" />
            <meta property="og:image" content={``} />
            <meta charSet="utf-8"></meta>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${data.info.analytics}`} />
            <Script
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
