import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  faCamera,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Skeleton,
  CircularProgress,
  Avatar,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  Stack
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AvatarEditor from "react-avatar-editor";
import { FaCamera, FaTimes, FaShare, FaChevronLeft } from "react-icons/fa";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import { RootState } from "../Redux/store/store";
import { PublicDataType, updateProfile } from "../Redux/slices/userProfileSlice";
import { toast } from "sonner";
import { formDataPostApi, PostApi } from "../Helper/ApiHandle/BsApiHandle";
import BsButton from "../Comp/BsButton";
import ConnectionStatusButton from "../Comp/ConnectionStatusButton";

interface IProfileUserDetailDashboardProps {
  bool: boolean;
  setBool: React.Dispatch<React.SetStateAction<boolean>>;
  unpaidModalShow: boolean;
  isPromoted?: any
}
interface IApiResponse {
  message: string;
}
const ProfileUserDetailDashboard: React.FC<IProfileUserDetailDashboardProps> = ({ setBool }) => {

  const editorRef = useRef<AvatarEditor>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const publicProfile = useSelector((store: RootState) => store.userProfile.publicData);
  const ShowData = useMemo(() => {
    return publicProfile as PublicDataType;
  }, [publicProfile]);

  const UserRole = useSelector((store: RootState) => store.userProfile.data?.role);
  const connectionStatus = useSelector((store: RootState) => store.userProfile.connectionStatus);
  const userId = useSelector((store: RootState) => store.userProfile.data?._id);

  const [isImageModal, setIsImageModal] = useState<string | false>(false);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (ShowData) {
      setIsLoading(false);
    }
  }, [ShowData]);
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = event.target.files?.[0];
    const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

    if (file) {
      if (file.size > maxSize) {
        // File size exceeds the maximum allowed size
        toast.error(
          "File size exceeds the maximum allowed size (5 MB). Please choose a smaller file.",
        );
        return; // Stop further execution
      }
      const reader = new FileReader();
      reader.onloadend = (ee) => {
        if (typeof ee.target?.result === 'string') {
          setDisplayImage(ee.target.result);
          setIsImageModal(category);
        }
      };
      reader.readAsDataURL(file);

      // Clear the selected file from the input element
      event.target.value = '';
    }
  };


  const handleNavigateToCompare = () => {
    navigate(`/participant-compare`, {
      state: { id: ShowData?._id, type: ShowData?.role, jobCompare: false },
    });
  }; // navigate to compare pagge

  // image modal close
  const handleCloseImageModal = () => {
    setIsImageModal(false);
    setDisplayImage(null);
  };


  const handleImageResize = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });

      if (blob) {
        const file = new File([blob], "image.png", { type: "image/png" });
        handleImageUpload(file);
      } else {

      }
    }
  };
  // Functionality: API call for for update profile & cover image
  const handleImageUpload = async (BlobFile: File) => {

    setIsLoader(true);
    const formData = new FormData();
    formData.append("image", BlobFile);
    const res = await formDataPostApi<any>(`/user/${isImageModal === "cover" ? "cover-image" : "profile-image"}`, formData, true);

    if (res) {
      dispatch(updateProfile());
      setBool((prev) => !prev);
      handleCloseImageModal()
    } else {
    }
    setIsLoader(false);
  };
  return (
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1,
      mb: 2,
      overflow: 'hidden'
    }}>
      {/* Back Button */}


      {/* Cover Photo */}
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={200} />
      ) : (
        <Box sx={{
          position: 'relative',
          height: 200,
          bgcolor: 'grey.200'
        }}>
          <div className="cover-img relative">
            <img
              // src={`${process.env.REACT_APP_BASE_URL_IMAGE}${ShowData?.coverImageUrl}?t=${Date.now()}`}
              src={`${ShowData?.coverImageUrl}?t=${Date.now()}`}
              alt=""
              width={"100%"}
            />
            {userId === ShowData?._id && (
              <label
                htmlFor="imageInput"
                className="absolute icon-size right-5 top-5 z-10 bg-white rounded-full flex items-center justify-center w-8 h-8 "
              >
                <FontAwesomeIcon icon={faCamera} color="#21948C" />
              </label>
            )}
            {/* Hidden input field for file upload */}
            <input
              id="imageInput"
              type="file"
              // accept="image/*"
              accept=".jpg, .jpeg, .png, .webp, .apng, .ico, .avif"
              onChange={(e) => handleCoverImageChange(e, "cover")}
              style={{ display: "none" }}
            />
          </div>
          {userId == ShowData?._id && (
            <>
              <label
                htmlFor="imageInput"
                className="absolute icon-size right-5 top-5 z-10 bg-white rounded-full flex items-center justify-center w-8 h-8 "
              >
                <FontAwesomeIcon icon={faCamera} color="#21948C" />
              </label>
              <input
                id="imageInput"
                type="file"
                // accept="image/*"
                accept=".jpg, .jpeg, .png, .webp, .apng, .ico, .avif"
                onChange={(e) => handleCoverImageChange(e, "cover")}
                style={{ display: "none" }}
              />
            </>
          )}
          <input
            id="imageInput"
            type="file"
            accept=".jpg, .jpeg, .png"
            style={{ display: "none" }}
          />
        </Box>
      )}

      {/* Profile Header */}
      <Box sx={{ px: 3, pt: 2, pb: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2
        }}>
          {/* Profile Picture */}
          <Box sx={{
            position: 'relative',
            mt: -6,
            mb: 1
          }}>
            {isLoading ? (
              <Skeleton variant="circular" width={100} height={100} />
            )
              : (
                <>
                  <Avatar
                    src={`${ShowData?.profileImageUrl}?t=${Date.now()}`}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '3px solid',
                      borderColor: 'background.paper'
                    }}
                  />
                  {userId == ShowData?._id && (
                    <label
                      htmlFor="imageInput2"
                      className="absolute -right-2 bottom-0  rounded-full flex items-center justify-center w-8 h-8"
                    >
                      <FontAwesomeIcon icon={faCamera} color="linear-gradient(180deg, #0072b5, #005a92)" />
                    </label>
                  )}
                  <input
                    id="imageInput2"
                    type="file"
                    // accept="image/*"
                    accept=".jpg, .jpeg, .png, .webp, .apng, .ico, .avif"

                    onChange={(e) => handleCoverImageChange(e, "profile")}
                    style={{ display: "none" }}
                  />

                </>
              )}
          </Box>

          {/* Edit Profile Button */}
          {userId === ShowData?._id && (
            <Link to="/user-profile-edit">
              <Button
                variant="outlined"
                size="small"
                startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
              >
                Edit
              </Button>
            </Link>
          )}
        </Box>

        {/* User Info */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" className="capitalize-first-letter" sx={{ fontWeight: 'bold', mr: 1 }}>
              {ShowData?.fullName || "User Name"}
            </Typography>
            <VerifiedUserIcon color="primary" fontSize="small" />
          </Box>

          <Typography className="capitalize-first-letter" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {ShowData?.role || "Role not specified"}
          </Typography>

          {ShowData?.abn && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Box component="span" sx={{
                bgcolor: 'warning.light',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                mr: 1
              }}>
                ABN
              </Box>
              {ShowData.abn}
            </Typography>
          )}
        </Box>

        {/* Stats */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          my: 2
        }}>
          <Typography variant="body2">
            <Box component="span" sx={{ fontWeight: 'bold' }}>
              {ShowData?.connections || 0}
            </Box> Connections
          </Typography>

        </Box>

        {/* Connect Button */}
        {userId !== ShowData?._id && (
          // <div className="w-22">
          // <BsButton isLoading={isLoading} label="Connect" />
          // </div>
          <ConnectionStatusButton
          key={Math.random()}
          status={connectionStatus}
          uId={ShowData?._id}
          showMessageButton={true}
        />
        )}

        <Divider sx={{ my: 2 }} />

        {/* Contact Info */}
        <Stack spacing={1}>
          {ShowData?.email && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {ShowData.email}
              </Typography>
            </Box>
          )}

          {(ShowData?.suburb || ShowData?.state) && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {`${ShowData?.suburb || ''}, ${ShowData?.state || ''}`}
              </Typography>
            </Box>
          )}

          {ShowData?.dateJoined && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                User since {new Date(ShowData.dateJoined).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {ShowData?.company && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {ShowData.company}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Image Editor Modal */}
      {isImageModal && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 1300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Box sx={{
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            width: isImageModal === "cover" ? '70%' : 'auto'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6">
                Edit {isImageModal} photo
              </Typography>
              <IconButton >
                <FaTimes />
              </IconButton>
            </Box>

            {displayImage && (
              <AvatarEditor
                ref={editorRef}
                image={displayImage}
                width={isImageModal === "cover" ? 500 : 200}
                height={isImageModal === "cover" ? 200 : 200}
                border={20}
                borderRadius={isImageModal === "cover" ? 0 : 100}
                color={[255, 255, 255, 0.6]}
                scale={1}
                rotate={0}
              />
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleImageResize}
                variant="contained"
                disabled={isLoader}
                startIcon={isLoader && <CircularProgress size={14} />}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProfileUserDetailDashboard;