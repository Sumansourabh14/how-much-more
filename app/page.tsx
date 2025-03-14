import UploadItemForm from "@/components/forms/UploadItemForm";

export default function Home() {
  return (
    <div className=" min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1>How much more?</h1>
        <div className="max-w-[500px] mx-auto">
          <UploadItemForm />
        </div>
      </div>
    </div>
  );
}
