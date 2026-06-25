import * as React from "react";
import { useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDelete } from "../../hooks/useDelete";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle } from "./dialog";

const DeleteResource = ({
  url,
  resourceName,
  children,
  refetch,
  queryKey,
  onSuccess,
}: {
  queryKey: string[];
  url: string;
  resourceName: string;
  children: React.ReactElement;
  refetch?: () => void;
  onSuccess?: () => void;
}) => {
  const { isDeleting, deleteResource } = useDelete({
    url,
    queryKey,
    resourceName,
  });
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const onDelete = async () => {
    await deleteResource();
    onClose();
    refetch?.();
    onSuccess?.();
  };

  return (
    <>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!mx-2 bg-[#F8F8F8] gap-0 w-full md:min-w-[550px] !rounded-xl  p-8">
          <div className="flex items-center justify-center p-10 mx-auto rounded-full w-fit bg-[#FCD2D3]">
            <RiDeleteBin6Line className="w-8 h-8 text-[#F74444]" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-medium text-[#333333] text-center mb-[40px] mt-8">
            {`تأكيد الحذف ${resourceName}`}
          </DialogTitle>
          <div className="grid grid-cols-2 gap-10">
            <Button
              onClick={onClose}
              className="bg-[#E6E6E7] text-[#363636] h-full text-2xl font-semibold py-3 rounded-[14px]"
            >
              {"إلغاء"}
            </Button>
            <Button
              disabled={isDeleting}
              className="bg-[#F74444] hover:bg-opacity-40 disabled:opacity-55 h-full
               disabled:cursor-not-allowed text-white py-3  font-semibold text-2xl rounded-[14px]"
              onClick={onDelete}
            >
              {isDeleting ? (
                <ImSpinner8 className="animate-spin" color="white" />
              ) : (
                "حذف"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {React.cloneElement(children, { onClick: onOpen })}
    </>
  );
};

export default DeleteResource;
