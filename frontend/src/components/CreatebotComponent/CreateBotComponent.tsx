
import { Button } from 'primereact/button';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, ItemTemplateOptions, } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import React, { useEffect, useRef, useState } from 'react';
import { IBot, ICreateBotDTo } from '../../models/Bots/bots';
import './CreateBotComponent.scss';

interface fileObjectWithUrl extends File {
  objectURL: string
}

interface CreateBotInterface {
  onSubmit: (bot: ICreateBotDTo, id: string) => void
  mode: 'edit' | 'create'
  bot?: IBot;
}

const titles = {
  edit: {
    FileUploadTitle: 'Drag and Drop Image or Click to Upload',
    submitButton: 'Save Changes'
  },
  create: {
    FileUploadTitle: 'Drag and Drop Image here or Upload new Image',
    submitButton: 'Create Bot'
  }
}

export const CreateEditBotComponent: React.FC<CreateBotInterface> = ({ onSubmit, mode, bot }) => {
  const toast = useRef<Toast>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [botName, setBotName] = useState('');
  const [password, setPassword] = useState('');
  const fileUploadRef = useRef<FileUpload>(null);
  const [cockpits, setCockpits] = useState<{ name: string, id: number }[]>([{ name: '', id: 0 }]);
  const [showCurrentImage, setShowCurrentImage] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const getCameraErrors = (): string[] => {
    const errors = [];
    const cockpitNames =  cockpits.filter((cockpit)=>cockpit.name.length >3).map((c)=>c.name)
    const hasDuplicates = cockpitNames.filter((name,index, array )=> array.indexOf(name) !== index)

    const emptyNames =  cockpits.some((cockpit)=> cockpit.name.length < 3) ?? false;

    console.log('empty names', emptyNames)
    console.log('has duplicates', hasDuplicates)

    if(emptyNames) errors.push('Cameras need to include a name ');
    if(hasDuplicates.length) errors.push('Camera names must all be unique')

    return errors;
  } 


  const isFormValid = (): boolean => {


    const cameraErrors = getCameraErrors()
    const tempErrors = [];
    if (!botName) tempErrors.push('Bot name is required');
    if (password.length < 3) tempErrors.push('Password needs to contain atleast 3 characters');
    if (cameraErrors.length) tempErrors.push(...cameraErrors);


    setErrors(tempErrors)

    return tempErrors.length === 0;
  }


  const handleCreateBot = () => {

    if (!isFormValid()) return;

    const files = fileUploadRef && fileUploadRef.current ? fileUploadRef.current?.getFiles() : [];

    onSubmit({
      name: botName,
      image: files[0],
      password,
      cockpits
    }, bot?.id ?? '')
  }

  useEffect(() => {
    if (mode !== 'edit') return;
    if (bot?.name) setBotName(bot.name)

    const cockpits: { name: string, id: number }[] = []

    if (bot?.cockpits) bot.cockpits.forEach((cp) => cockpits.push({ name: cp.name, id: cp.id }))
    setCockpits(cockpits)
  }, [])

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = totalSize;
    let files = e.files;

    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0;
    }

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize(totalSize - file.size);
    callback();
    setShowCurrentImage(true)
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    setShowCurrentImage(true)
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {

    const { className, chooseButton } = options;
    const value = totalSize / 20000;
    const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 2 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as fileObjectWithUrl;

    if (mode === 'edit' && file) setShowCurrentImage(false)

    return (
      <div className="flex-col align-items-center flex-wrap">
        <div className='flex'>
          <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
          <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
        </div>
        {
          <img alt={file.name} role="presentation" src={file?.objectURL} width={"100%"} />
        }
      </div>
    );
  };

  const handleCockpitChange = (key: number, name: string) => {

    const newCockpits: { name: string, id: number }[] = cockpits.map((cockpit, index) => {
      if (cockpit.id === key) return {
        id: key,
        name
      }

      return cockpit
    })

    setCockpits(newCockpits)
  }

  const emptyTemplate = () => {
    const InputElement = fileUploadRef.current?.getInput()


    if (!InputElement) {
      return null;
    }
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-secondary rounded-md p-5 ">
        <i className="pi pi-image mt-3 p-5 bg-primary color-secondary  rounded-full" style={{ fontSize: '5em' }}></i>
        <Button className="border-2 border-solid border-secondary rounded-sm p-5" onClick={() => InputElement.click()} style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} >
          Drag and Drop Image or Click to Upload
        </Button>
      </div>
    );
  };

  const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
  const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

  return (
    <div className='create-bot-form'>
      <Tooltip className='custom-choose-btn' target=".custom-choose-btn" content="find on machine" position="bottom" />
      <div className='create-bot-form-input-group'>
        <div className='bot-details-form-group relative'>
          <InputText value={botName} onChange={(e) => setBotName(e.currentTarget.value)} className='bot-details-name' placeholder='Bot Name' />
        </div>

        <div className='bot-passwords-form-group'>
          <div style={{ display: 'flex', width: '50%', justifyContent: 'center', position: 'relative' }}>
            <InputText style={{ width: '100%', margin: 0 }} type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.currentTarget.value)} placeholder='Bot Password' />
            <i style={{ color: '#4ddfc0' }} onClick={() => setShowPassword(!showPassword)} className={`absolute hoverIcon  right-2 top-4 ${!showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}`}></i>
          </div>
        </div>
        <div style={{ width: '50%', margin: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button style={{ maxHeight: '30px', }} disabled={cockpits.length < 1} onClick={() => setCockpits(cockpits.slice(0, -1))} icon='pi pi-minus' />
            <h3>Cameras</h3>
            <Button style={{ maxHeight: '30px', }} onClick={() => setCockpits([...cockpits, { id: Math.max(...cockpits.map((cp) => cp.id)) + 1, name: '' }])} icon='pi pi-plus' />
          </div>
        </div>



        <div style={{ display: 'flex', height: '70%', boxSizing: 'border-box', width: '100%' }} >
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {cockpits.map((cockpit, key) => {
              return (<div key={cockpit.id} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}><InputText key={cockpit.id} value={cockpit.name} style={{ width: '50%', }} onChange={(event) => handleCockpitChange(cockpit.id, event.target.value)} placeholder={`Camera ${key + 1}`} /></div>)
            })}
          </div>
        </div>
      </div>
      <div className='file-upload-component'>
        <FileUpload
          multiple={false}
          ref={fileUploadRef} name="demo[]" url="/api/upload" accept="image/*" maxFileSize={20000000}
          onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
          headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
          chooseOptions={chooseOptions} cancelOptions={cancelOptions} />
      </div>

      {showCurrentImage && bot?.imageUrl?.length ? <img alt='bot' src={bot?.imageUrl} /> : null}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', }}>
        <Button onClick={handleCreateBot} style={{ padding: '1rem' }} label={`${titles[mode].submitButton}`} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '70%', marginLeft: '25%', }}>
        {errors.map((error, index) => (<li key={index} style={{ listStyle: 'inside', color: 'red' }}>{error}</li>))}
      </div>

    </div>
  )
}
