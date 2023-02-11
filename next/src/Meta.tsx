const Meta = ({ id, url, description, keywords, image }: any) => {
	return (
		<>
			<meta name="keywords" content={keywords}></meta>
			<meta name="description" content={description}></meta>
			<meta property="og:type" content="website" />
			<meta
				property="og:image"
				content={`${url}api/uploads/${process.env.NEXT_PUBLIC_SITE_ID}/${image}`}
			/>
			<meta charSet="utf-8"></meta>
			{/* Global Site Tag (gtag.js) - Google Analytics */}
			<script
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
			/>
			<script
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
		</>
	);
};

export default Meta;
