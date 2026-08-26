import logo from "@/assets/unnamed_7.webp.asset.json";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-4 text-center">
        <img src={logo.url} alt="Abhyas Reading Library logo" className="h-12 w-12 mx-auto mb-3 object-contain" />
        <p className="font-serif text-lg font-bold gold-text mb-2">Abhyas Reading Library</p>
        <p className="text-primary/70 text-sm mb-2">Where preparation meets comfort.</p>
        <p className="text-foreground/40 text-sm">Chandkheda, Ahmedabad • The perfect place to study seriously.</p>
        <p className="text-foreground/30 text-xs mt-4">© {new Date().getFullYear()} Abhyas Reading Library. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
